import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherStage, Whiteboard } from '../components/classroom/TeacherStage'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Alert, Spinner } from '../components/ui/Feedback'
import { Card } from '../components/ui/Card'
import { useSession } from '../context/SessionContext'
import { Pause, Play, SkipForward } from 'lucide-react'
import { evaluateAnswer, speak, getLesson, type AdaptiveFeedback } from '../lib/api'

export function ClassroomPage() {
  const { teacher, profile, setLanguage } = useSession()
  const nav = useNavigate()
  const { id } = useParams()
  
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [choice, setChoice] = useState('')
  const [evaluated, setEvaluated] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [thread, setThread] = useState<string[]>([])
  const [feedback, setFeedback] = useState<AdaptiveFeedback | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (id) {
      getLesson(id)
        .then(setPlan)
        .catch(e => setError(e.message))
    }
  }, [id])

  const current = plan?.steps[step]
  const isQuestion = current?.type === 'question'
  const wrong = evaluated && feedback && !feedback.understood

  const caption = useMemo(() => {
    if (!current) return ''
    if (profile.language === 'hi' && current.scriptHi) return current.scriptHi
    return current.script
  }, [current, profile.language])

  if (error) return <div className="p-8"><Alert tone="error" title="Error">{error}</Alert></div>
  if (!plan || !current) return <div className="p-8"><Spinner label="Loading classroom..." /></div>

  function next() {
    if (step >= plan.steps.length - 1) {
      nav(`/app/assess/${plan.id}`)
      return
    }
    setStep((s) => s + 1)
    setChoice('')
    setEvaluated(false)
    setFeedback(null)
  }

  return (
    <div className="container-page space-y-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">AI Video classroom · UI avatar & TTS voice</p>
          <h1 className="font-display text-2xl">{plan.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setLanguage(profile.language === 'hi' ? 'en' : 'hi')}
          >
            Switch to {profile.language === 'hi' ? 'English' : 'Hindi'}
          </Button>
          <Link to={`/app/plan/${plan.id}`}>
            <Button size="sm" variant="ghost">
              Lesson plan
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {plan.steps.map((s: any, i: number) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${
              i === step ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <TeacherStage name={teacher.name} speaking={playing && !isQuestion} caption={caption} />
          <Whiteboard kind={current.visual} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} onClick={() => {
              if (playing) window.speechSynthesis?.cancel()
              else speak(caption, profile.language)
              setPlaying((p) => !p)
            }}>
              {playing ? 'Pause voice' : 'Play voice'}
            </Button>
            <Button size="sm" variant="secondary" icon={<SkipForward className="h-4 w-4" />} onClick={next} disabled={isQuestion && !evaluated}>
              {step === plan.steps.length - 1 ? 'Go to assessment' : 'Continue'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Student interaction</h2>
              <Badge tone="amber">Not a monologue</Badge>
            </div>
            {isQuestion ? (
              <div className="mt-4 space-y-3">
                <p className="font-medium text-slate-800">{current.script}</p>
                <div className="space-y-2">
                  <textarea
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="Type your answer..."
                    value={choice}
                    onChange={(e) => setChoice(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  size="sm"
                  disabled={!choice || checking}
                  onClick={async () => {
                    setChecking(true)
                    try {
                      const result = await evaluateAnswer({ answer: choice, correct: current.script })
                      setFeedback(result)
                      setEvaluated(true)
                    } catch {
                      setFeedback({ understood: false, feedback: 'The local lesson server is unavailable. Start it with npm run server.' })
                      setEvaluated(true)
                    } finally {
                      setChecking(false)
                    }
                  }}
                >
                  {checking ? 'Checking…' : 'Submit answer'}
                </Button>
                {evaluated && !wrong && feedback && (
                  <Alert tone="success" title="Understood">
                    {feedback.feedback}
                  </Alert>
                )}
                {wrong && feedback && (
                  <Alert tone="warn" title="Misconception spotted">
                    {feedback.feedback} {feedback.alternative}
                  </Alert>
                )}
              </div>
            ) : (
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <p>{current.type === 'adapt' ? 'The teacher changed analogy because the last answer showed a gap. Confirm, then continue.' : 'Watch the board. A check-in question will pause the lesson at a natural point.'}</p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-lg">Follow-up (keeps lesson context)</h2>
            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm">
              {thread.length === 0 && <p className="text-slate-500">Ask a question about this step.</p>}
              {thread.map((t, i) => (
                <p key={i} className="rounded-lg bg-slate-50 p-2">
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="focus-ring flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Type a question..."
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (!followUp.trim()) return
                  setThread((t) => [
                    ...t,
                    `You: ${followUp}`,
                    'Meera: I am an AI, this Q&A is currently simulated in this prototype, but could be wired to Gemini!',
                  ])
                  setFollowUp('')
                }}
              >
                Ask
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
