import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const root = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(root, '.env.local') })
dotenv.config() 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' })
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-vidya'

const dataDir = join(root, 'data')
mkdirSync(dataDir, { recursive: true })
const db = new Database(join(dataDir, 'vidya.db'))

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT
  );
  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    userId TEXT,
    name TEXT,
    type TEXT,
    textContent TEXT,
    extractedConcepts TEXT,
    createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    userId TEXT,
    materialId TEXT,
    topic TEXT,
    level TEXT,
    title TEXT,
    lessonData TEXT,
    createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    userId TEXT,
    lessonId TEXT,
    score INTEGER,
    recommendation TEXT,
    createdAt TEXT
  );
`)

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': 'http://localhost:5173', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' })
  res.end(JSON.stringify(body))
}
async function bodyOf(req) { let raw = ''; for await (const part of req) raw += part; return raw ? JSON.parse(raw) : {} }

function getUserId(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded.userId
  } catch (e) {
    return null
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {})
  const url = new URL(req.url ?? '/', 'http://localhost:8787')
  
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true })
    
    // Auth Routes
    if (req.method === 'POST' && url.pathname === '/api/auth/register') {
      const { name, email, password } = await bodyOf(req)
      if (!name || !email || !password) return send(res, 400, { error: 'Name, email, and password required' })
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
      if (existing) return send(res, 400, { error: 'Email already registered' })
      
      const id = 'user-' + Date.now().toString(36)
      const hash = bcrypt.hashSync(password, 10)
      db.prepare('INSERT INTO users (id, name, email, passwordHash) VALUES (?, ?, ?, ?)').run(id, name, email, hash)
      const token = jwt.sign({ userId: id }, JWT_SECRET)
      return send(res, 201, { token, user: { id, name, email } })
    }
    
    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password } = await bodyOf(req)
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return send(res, 401, { error: 'Invalid email or password' })
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET)
      return send(res, 200, { token, user: { id: user.id, name: user.name, email: user.email } })
    }
    
    if (req.method === 'GET' && url.pathname === '/api/auth/me') {
      const userId = getUserId(req)
      if (!userId) return send(res, 401, { error: 'Unauthorized' })
      const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId)
      if (!user) return send(res, 404, { error: 'User not found' })
      return send(res, 200, { user })
    }

    // Require auth for modifying endpoints (except auth itself)
    const userId = getUserId(req)
    if (!userId && url.pathname !== '/api/health' && !url.pathname.startsWith('/api/lessons/')) {
       if (req.method === 'POST') return send(res, 401, { error: 'Unauthorized' })
    }

    if (req.method === 'GET' && url.pathname === '/api/materials') {
      if (!userId) return send(res, 401, { error: 'Unauthorized' })
      const materials = db.prepare('SELECT * FROM materials WHERE userId = ? ORDER BY createdAt DESC').all(userId)
      return send(res, 200, materials.map(m => ({ ...m, extractedConcepts: JSON.parse(m.extractedConcepts) })))
    }
    
    if (req.method === 'POST' && url.pathname === '/api/materials') {
      const input = await bodyOf(req); 
      if (!input.name) return send(res, 400, { error: 'A material name is required.' })
      
      let textContent = "";
      let extractedConcepts = ['Topic extracted'];
      
      if (input.content) {
        try {
           const buffer = Buffer.from(input.content, 'base64');
           const pdfData = await pdfParse(buffer);
           textContent = pdfData.text.substring(0, 15000);
           
           if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy') {
             const aiResp = await ai.models.generateContent({
               model: 'gemini-3.6-flash',
               contents: `Extract up to 5 key concepts from this text. Return JSON: {"concepts": ["..."]}. Text: ${textContent.substring(0, 5000)}`,
               config: { responseMimeType: "application/json" }
             });
             const cleanText = aiResp.text.replace(/```json/g, '').replace(/```/g, '').trim();
             const parsed = JSON.parse(cleanText);
             extractedConcepts = parsed.concepts || extractedConcepts;
           }
        } catch (err) {
           console.error("PDF Parse error", err);
        }
      }

      const id = 'material-' + Date.now().toString(36)
      db.prepare('INSERT INTO materials (id, userId, name, type, textContent, extractedConcepts, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
        id, userId, input.name, input.type || 'pdf', textContent, JSON.stringify(extractedConcepts), new Date().toISOString()
      )
      
      return send(res, 201, { id, name: input.name, extractedConcepts })
    }
    
    if (req.method === 'POST' && url.pathname === '/api/lessons') {
      const { topic, profile = {}, materialId } = await bodyOf(req);
      const level = profile.level ?? 'beginner', language = profile.language ?? 'en', timeBudget = profile.timeBudget ?? '20m'
      
      let context = "";
      if (materialId) {
        const mat = db.prepare('SELECT textContent FROM materials WHERE id = ? AND userId = ?').get(materialId, userId)
        if (mat) context = `Use this material context: ${mat.textContent ? mat.textContent.substring(0, 10000) : ''}`;
      }

      const prompt = `You are an AI teacher planning a lesson.
Topic: ${topic}
Target Audience: ${level}
Language: ${language}
Time Budget: ${timeBudget} (5m=concise, 20m=structured, 60m=deep)
${context}

Return a JSON object with this exact structure:
{
  "title": "...",
  "visualsPlan": "...",
  "steps": [
    {
      "type": "intro" | "explain" | "demonstrate" | "question" | "adapt" | "assess",
      "title": "Step title",
      "durationMin": 2,
      "visual": "diagram" | "graph" | "process",
      "script": "The exact script you will say as the teacher."
    }
  ]
}
Make sure to include at least one 'question' step. Return ONLY valid JSON.`;

      let lessonData = null;
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy') {
        try {
          const aiResp = await ai.models.generateContent({
             model: 'gemini-3.6-flash',
             contents: prompt,
             config: { responseMimeType: "application/json" }
          });
          const cleanText = aiResp.text.replace(/```json/g, '').replace(/```/g, '').trim();
          lessonData = JSON.parse(cleanText);
        } catch(e) { console.error("Gemini Lesson error:", e); }
      }

      if (!lessonData) {
         lessonData = {
           title: `${topic} - ${level}`,
           visualsPlan: "Fallback board",
           steps: [
             { type: 'explain', title: 'Intro', durationMin: 2, visual: 'diagram', script: 'Hello, this is a fallback. Please set GEMINI_API_KEY.' }
           ]
         };
      }

      const id = 'lesson-' + Date.now().toString(36)
      
      lessonData.steps = (lessonData.steps || []).map((s, i) => ({ id: id + '-s' + (i+1), ...s }));

      db.prepare('INSERT INTO lessons (id, userId, materialId, topic, level, title, lessonData, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        id, userId, materialId || null, topic, level, lessonData.title, JSON.stringify(lessonData), new Date().toISOString()
      )

      return send(res, 201, { id, topic, level, ...lessonData })
    }
    
    if (req.method === 'GET' && url.pathname.startsWith('/api/lessons/')) {
      const id = url.pathname.split('/').pop()
      const row = db.prepare('SELECT * FROM lessons WHERE id = ?').get(id)
      if (!row) return send(res, 404, { error: 'Lesson not found.' })
      return send(res, 200, { id: row.id, topic: row.topic, level: row.level, ...JSON.parse(row.lessonData) })
    }

    if (req.method === 'GET' && url.pathname === '/api/dashboard') {
      if (!userId) return send(res, 401, { error: 'Unauthorized' })
      const lessonCount = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE userId = ?').get(userId).count
      const assessments = db.prepare('SELECT score FROM assessments WHERE userId = ?').all(userId)
      const avgScore = assessments.length ? Math.round(assessments.reduce((a, b) => a + b.score, 0) / assessments.length) : 0
      const recentLessons = db.prepare('SELECT id, title, topic, createdAt FROM lessons WHERE userId = ? ORDER BY createdAt DESC LIMIT 5').all(userId)
      return send(res, 200, { lessonCount, avgScore, recentLessons })
    }

    if (req.method === 'GET' && url.pathname === '/api/notes') {
      if (!userId) return send(res, 401, { error: 'Unauthorized' })
      const recentLessons = db.prepare('SELECT id, title, topic, lessonData FROM lessons WHERE userId = ? ORDER BY createdAt DESC LIMIT 5').all(userId)
      
      const notes = recentLessons.map(lesson => {
        let body = ''
        try {
          const data = JSON.parse(lesson.lessonData)
          // Extract the scripts or explanations from the steps to form a summary note
          body = data.steps
            .filter(s => s.type === 'explain' || s.type === 'demonstrate')
            .map(s => s.script)
            .join(' ')
            .substring(0, 500) + '...'
        } catch (e) {
          body = 'No summary available.'
        }
        return { id: lesson.id, title: lesson.title || lesson.topic, body }
      })
      
      return send(res, 200, { notes })
    }
    
    if (req.method === 'POST' && url.pathname === '/api/answers') {
      const { answer = '', correct = '', misconception = '', alternative = '' } = await bodyOf(req);
      
      let result;
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy') {
         const prompt = `A student was asked a question where the correct concept is: "${correct}".
The student answered: "${answer}".
Does the student's answer show understanding of the correct concept?
Return JSON:
{
  "understood": true/false,
  "feedback": "A short feedback message to the student.",
  "alternative": "If they didn't understand, provide a simpler analogy or explanation."
}`;
         try {
           const aiResp = await ai.models.generateContent({
               model: 'gemini-3.6-flash',
               contents: prompt,
               config: { responseMimeType: "application/json" }
           });
           const cleanText = aiResp.text.replace(/```json/g, '').replace(/```/g, '').trim();
           result = JSON.parse(cleanText);
         } catch(e) { console.error("Gemini Answer error:", e); }
      }

      if (!result) {
         const understood = answer.trim().toLowerCase() === correct.trim().toLowerCase()
         result = understood ? { understood: true, feedback: 'Correct.' } : { understood: false, feedback: misconception || 'Incorrect.', alternative: alternative || 'Try again.' }
      }

      return send(res, 200, result)
    }
    
    if (req.method === 'POST' && url.pathname === '/api/assessments') {
      const { answers = {}, lessonId } = await bodyOf(req);
      
      let lessonRow = null
      if (lessonId) lessonRow = db.prepare('SELECT lessonData FROM lessons WHERE id = ?').get(lessonId)
      const lesson = lessonRow ? JSON.parse(lessonRow.lessonData) : null
      
      let score = 0;
      let recommendation = 'Move to the recommended next topic.';
      
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy') {
         const prompt = `You are a teacher grading a 4-question quiz.
Lesson Context: ${lesson ? JSON.stringify(lesson.steps) : 'None'}
Student Answers: ${JSON.stringify(answers)}

Grade the answers based on the context. Return a JSON object with:
{
  "score": <number between 0 and 100>,
  "recommendation": "<short feedback message>"
}`;
         try {
           const aiResp = await ai.models.generateContent({
               model: 'gemini-3.6-flash',
               contents: prompt,
               config: { responseMimeType: "application/json" }
           });
           const cleanText = aiResp.text.replace(/```json/g, '').replace(/```/g, '').trim();
           const result = JSON.parse(cleanText);
           score = result.score || 0;
           recommendation = result.recommendation || 'Keep practicing.';
         } catch(e) { console.error("Gemini Assessment error:", e); }
      } else {
         const answered = Object.values(answers).filter((answer) => String(answer).trim()).length;
         score = Math.min(100, Math.round((answered / 4) * 100));
         recommendation = score < 75 ? 'Revise the key concept with a new analogy.' : 'Move to the recommended next topic.';
      }
      
      const id = 'assess-' + Date.now().toString(36)
      db.prepare('INSERT INTO assessments (id, userId, lessonId, score, recommendation, createdAt) VALUES (?, ?, ?, ?, ?, ?)').run(
        id, userId, lessonId || null, score, recommendation, new Date().toISOString()
      )
      
      return send(res, 200, { score, recommendation });
    }
    
    // If not an /api route, serve static files for the frontend
    if (!url.pathname.startsWith('/api')) {
      // Basic static file server for deployment (assuming frontend is built to /dist)
      const distPath = join(root, 'dist')
      const extMap = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      }
      
      let filePath = join(distPath, url.pathname)
      if (url.pathname === '/') filePath = join(distPath, 'index.html')
      
      if (!existsSync(filePath) || !url.pathname.includes('.')) {
         // React router fallback
         filePath = join(distPath, 'index.html')
      }
      
      if (existsSync(filePath)) {
        const ext = '.' + filePath.split('.').pop()
        res.writeHead(200, { 'Content-Type': extMap[ext] || 'text/plain' })
        res.end(readFileSync(filePath))
        return
      }
    }
    
    return send(res, 404, { error: 'Route not found.' })
  } catch (error) { return send(res, 500, { error: error instanceof Error ? error.message : 'Server error.' }) }
})
server.listen(8787, () => console.log('Vidya API listening at http://localhost:8787'))
