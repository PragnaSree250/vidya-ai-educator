export type AdaptiveFeedback = { understood: boolean; feedback: string; alternative?: string }
async function request<T>(path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('vidya_token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  
  const response = await fetch(`/api${path}`, { method: body === undefined ? 'GET' : 'POST', headers, body: body === undefined ? undefined : JSON.stringify(body) })
  if (!response.ok) {
    if (response.status === 401 && token) {
       localStorage.removeItem('vidya_token');
       window.location.href = '/app/auth';
    }
    throw new Error((await response.json().catch(() => null))?.error ?? 'Request failed.')
  }
  return response.json() as Promise<T>
}

// Auth Endpoints
export function login(credentials: any) { return request<{token: string, user: any}>('/auth/login', credentials) }
export function register(credentials: any) { return request<{token: string, user: any}>('/auth/register', credentials) }
export function getMe() { return request<{user: any}>('/auth/me') }

export function getDashboard() { return request<any>('/dashboard') }
export function getNotes() { return request<{ notes: any[] }>('/notes') }
export function getMaterials() { return request<any[]>('/materials') }

export function createMaterial(name: string, content?: string) { const extension = name.split('.').pop()?.toLowerCase(); return request<{ id: string, extractedConcepts: string[] }>('/materials', { name, content, type: extension === 'ppt' || extension === 'pptx' ? 'pptx' : extension === 'doc' || extension === 'docx' ? 'docx' : 'pdf' }) }
export function createLesson(topic: string, profile: unknown, materialId?: string) { return request<{ id: string }>('/lessons', { topic, profile, materialId }) }
export function evaluateAnswer(input: { answer: string; correct: string; misconception?: string; alternative?: string }) { return request<AdaptiveFeedback>('/answers', input) }
export function getLesson(id: string) { return request<any>(`/lessons/${id}`) }
export function submitAssessment(lessonId: string, answers: any) { return request<{score: number, recommendation: string}>('/assessments', { lessonId, answers }) }
export function speak(text: string, language: string) { if (!('speechSynthesis' in window)) return false; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'; window.speechSynthesis.speak(utterance); return true }
