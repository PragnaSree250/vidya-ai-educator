import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Textarea } from '../components/ui/Field'
import { Alert } from '../components/ui/Feedback'
import { submitAssessment } from '../lib/api'

const dynamicQuestions = [
  { id: 'q1', prompt: 'Explain the main concept introduced in this lesson in your own words.', kind: 'Short Answer' },
  { id: 'q2', prompt: 'How would you apply this concept in a real-world scenario?', kind: 'Application' },
  { id: 'q3', prompt: 'What do you think is a common misconception about this topic?', kind: 'Critical Thinking' },
  { id: 'q4', prompt: 'Summarize the entire lesson in one sentence.', kind: 'Summary' },
]

export function AssessPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    const missing = dynamicQuestions.some((q) => !answers[q.id]?.trim())
    if (missing) {
      setError('Answer every question so Vidya can build a fair learning report.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      // Send the answers to the backend where Gemini will grade them based on the lesson context!
      const result = await submitAssessment(id!, answers)
      // Since the frontend report page expects data, we'll store the result in sessionStorage for the report page to display.
      sessionStorage.setItem(`report_${id}`, JSON.stringify(result))
      nav(`/app/report/${id}`)
    } catch (e: any) {
      setError(e.message || 'Failed to submit assessment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <h1 className="font-display text-3xl">Lesson assessment</h1>
        <p className="mt-1 text-slate-600">Answer these questions to demonstrate your understanding.</p>
      </div>
      {error && <Alert tone="error" title={error} />}
      {dynamicQuestions.map((q, i) => (
        <Card key={q.id}>
          <p className="text-xs uppercase text-slate-500">
            {q.kind} · {i + 1}
          </p>
          <p className="mt-1 font-medium">{q.prompt}</p>
          <div className="mt-3">
            <Field label="Your answer">
              <Textarea
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                rows={4}
              />
            </Field>
          </div>
        </Card>
      ))}
      <Button onClick={submit} disabled={submitting}>
        {submitting ? 'Grading with AI...' : 'Submit Assessment'}
      </Button>
    </div>
  )
}
