import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { Alert, Spinner } from '../components/ui/Feedback'
import { useSession } from '../context/SessionContext'
import type { TimeBudget } from '../types'
import { FileUp } from 'lucide-react'
import { createLesson, createMaterial } from '../lib/api'

const topicSuggestions = [
  'Explain Ohm’s Law simply',
  'How do vaccines work?',
  'Teach me the basics of Python',
  'What is Photosynthesis?',
]

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
]

export function LearnPage() {
  const nav = useNavigate()
  const { profile, setProfile } = useSession()
  const [mode, setMode] = useState<'upload' | 'topic'>('upload')
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [error, setError] = useState('')
  const [materialId, setMaterialId] = useState<string>()
  const [generating, setGenerating] = useState(false)
  const [topic, setTopic] = useState('Teach me Chapter 4 in 20 minutes. Explain in Hindi using simple examples.')

  async function handleFile(file: File | undefined) {
    if (!file) return
    const name = file.name
    const ok = /\.(pdf|docx?|pptx?)$/i.test(name)
    if (!ok) {
      setError('Please upload PDF, DOC/DOCX, or PPT/PPTX. Other files are not processed in this prototype.')
      setParsed(false)
      return
    }
    setError('')
    setFileName(name)
    setParsing(true)
    setParsed(false)
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = (e.target?.result as string)?.split(',')[1] || '' // Extract Base64
      setParsing(false)
      setParsed(true)
      try {
        const material = await createMaterial(name, content)
        setMaterialId(material.id)
      } catch (err) {
        setError('Failed to process material on server.')
      }
    }
    reader.onerror = () => {
      setParsing(false)
      setError('Failed to read file on the client.')
    }
    reader.readAsDataURL(file)
  }

  async function generatePlan() {
    setGenerating(true)
    setError('')
    try {
      const lesson = await createLesson(mode === 'topic' ? topic : 'Extracted Material Topic', profile, materialId)
      nav('/app/plan/' + lesson.id)
    } catch {
      setError('Start the local lesson server with npm run server, then generate the plan again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <h1 className="font-display text-3xl">Start a lesson</h1>
        <p className="mt-1 text-slate-600">Upload material or give a topic. Vidya will plan before it teaches.</p>
      </div>

      <div className="flex gap-2">
        <Button variant={mode === 'upload' ? 'primary' : 'secondary'} onClick={() => setMode('upload')}>
          Upload material
        </Button>
        <Button variant={mode === 'topic' ? 'primary' : 'secondary'} onClick={() => setMode('topic')}>
          Teach a topic
        </Button>
      </div>

      {mode === 'upload' && (
        <Card>
          <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <FileUp className="h-8 w-8 text-brand-600" />
            <p className="mt-3 font-medium">Drop a book, PDF, notes, or slides</p>
            <p className="mt-1 text-sm text-slate-500">PDF, DOC, DOCX, PPT, PPTX</p>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          {error && (
            <div className="mt-4">
              <Alert tone="error" title="Unsupported file">
                {error}
              </Alert>
            </div>
          )}
          {parsing && (
            <div className="mt-4">
              <Spinner label="Extracting knowledge from document..." />
            </div>
          )}
          {parsed && (
            <div className="mt-4">
              <Alert tone="success" title={'Grounded on ' + fileName}>
                Document processed successfully.
              </Alert>
            </div>
          )}
        </Card>
      )}

      {mode === 'topic' && (
        <Card>
          <Field label="What should Vidya teach?">
            <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          <div className="mt-3 flex flex-wrap gap-2">
            {topicSuggestions.map((t: string) => (
              <button
                key={t}
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1 text-left text-xs text-slate-700 hover:bg-brand-50"
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="font-display text-xl">Personalise this session</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Available time">
            <Select
              value={profile.timeBudget}
              onChange={(e) => setProfile({ ...profile, timeBudget: e.target.value as TimeBudget })}
            >
              <option value="5m">5 min — concise</option>
              <option value="20m">20 min — structured</option>
              <option value="60m">60 min — deep + assessment</option>
              <option value="7d">7-day plan</option>
            </Select>
          </Field>
          <Field label="Teaching language">
            <Select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value as typeof profile.language })}
            >
              {languages.map((l: { code: string, label: string }) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Instruction to the teacher" hint="Natural language is enough.">
            <Input defaultValue="Ask me questions during the lesson and test me at the end." />
          </Field>
          <Field label="Depth">
            <Select
              value={profile.depth}
              onChange={(e) =>
                setProfile({ ...profile, depth: e.target.value as typeof profile.depth })
              }
            >
              <option value="overview">Overview</option>
              <option value="standard">Standard</option>
              <option value="deep">Deep dive</option>
            </Select>
          </Field>
        </div>
        <Button
          className="mt-6"
          onClick={generatePlan}
          disabled={mode === 'upload' && !parsed}
        >
          {generating ? 'Generating plan...' : 'Generate lesson plan'}
        </Button>
        {mode === 'upload' && !parsed && (
          <p className="mt-2 text-xs text-slate-500">Upload a file first, or switch to topic mode.</p>
        )}
      </Card>
    </div>
  )
}
