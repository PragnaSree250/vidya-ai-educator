import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getLesson, getDashboard } from '../lib/api'
import { Spinner, Alert } from '../components/ui/Feedback'

export function ReportPage() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lessonId) {
      setError('No lesson ID provided.')
      setLoading(false)
      return
    }
    
    Promise.all([getLesson(lessonId), getDashboard()])
      .then(([lData, sData]) => {
        setLesson(lData)
        setStats(sData)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [lessonId])

  if (error) return <div className="p-8"><Alert tone="error" title={error} /></div>
  if (loading || !lesson || !stats) return <div className="p-8"><Spinner label="Loading report..." /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <h1 className="font-display text-3xl">Learning report · {lesson.topic}</h1>
        <p className="mt-1 text-slate-600">Personalised feedback after the lesson — not just a score.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Overall Average Score</p>
          <p className="font-display text-5xl text-brand-700">{stats.avgScore}%</p>
          <div className="mt-3">
            <ProgressBar value={stats.avgScore} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Strong areas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="green">General Understanding</Badge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Needs improvement</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="rose">Specific terminology</Badge>
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="font-display text-xl">Feedback</h2>
        <p className="mt-2 text-slate-700">The teacher noted your progress on {lesson.topic}. Keep practicing to solidify these concepts.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/app">
            <Button>Return to Dashboard</Button>
          </Link>
          <Link to="/app/learn">
            <Button variant="secondary">Start next topic</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
