import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { getDashboard } from '../lib/api'
import { Spinner, Alert } from '../components/ui/Feedback'

export function ProgressPage() {
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <div className="p-8"><Alert tone="error" title={error} /></div>
  if (loading) return <div className="p-8"><Spinner label="Loading progress..." /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <h1 className="font-display text-3xl">Student learning profile</h1>
      <p className="text-slate-600">Topics studied, scores, and the current path — used to personalise the next lesson.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total Lessons</p>
          <p className="font-display text-4xl">{stats.lessonCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Average score</p>
          <p className="font-display text-4xl">{stats.avgScore}%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Recent topic</p>
          <p className="mt-1 font-medium">{stats.recentLessons[0]?.topic || 'None'}</p>
        </Card>
      </div>
      <Card>
        <h2 className="font-display text-xl">Recent Topics Mastery</h2>
        <div className="mt-4 space-y-3">
          {stats.recentLessons.length > 0 ? stats.recentLessons.map((l: any) => (
            <ProgressBar key={l.id} value={stats.avgScore} label={l.topic || l.title} />
          )) : (
            <p className="text-sm text-slate-500">No lessons completed yet.</p>
          )}
        </div>
      </Card>
      <Card>
        <h2 className="font-display text-xl">Learning analytics</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={stats.avgScore >= 80 ? 'green' : 'amber'}>
            Overall average: {stats.avgScore}%
          </Badge>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Future sessions will use your previous history to adjust the time budget and language setting dynamically.
        </p>
      </Card>
    </div>
  )
}
