import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useSession } from '../context/SessionContext'
import { Clock, Languages, Sparkles } from 'lucide-react'
import { getDashboard } from '../lib/api'
import { Spinner, Alert } from '../components/ui/Feedback'

export function DashboardPage() {
  const { profile, teacher } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(e => setError(e.message))
  }, [])

  if (error) return <div className="p-8"><Alert tone="error" title={error} /></div>
  if (!stats) return <div className="p-8"><Spinner label="Loading dashboard..." /></div>

  const recent = stats.recentLessons[0]

  return (
    <div className="container-page space-y-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Good afternoon, {profile.name.split(' ')[0]}</p>
          <h1 className="font-display text-3xl text-ink-900">Ready for a real lesson, not a chat.</h1>
        </div>
        <Link to="/app/learn">
          <Button icon={<Sparkles className="h-4 w-4" />}>Start new lesson</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-slate-500">Teacher</p>
          <p className="mt-1 font-display text-2xl">{teacher.name}</p>
          <p className="text-sm text-slate-600">{teacher.title}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Level & time</p>
          <p className="mt-1 font-display text-2xl capitalize">{profile.level}</p>
          <p className="flex items-center gap-1 text-sm text-slate-600">
            <Clock className="h-3.5 w-3.5" /> {profile.timeBudget} sessions
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Language</p>
          <p className="mt-1 flex items-center gap-2 font-display text-2xl uppercase">
            <Languages className="h-6 w-6 text-brand-600" /> {profile.language}
          </p>
          <p className="text-sm text-slate-600">English textbook → Hindi teaching</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {recent ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">Continue: {recent.topic}</h2>
                <Badge tone="indigo">Recent topic</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Overall Average Score: {stats.avgScore}%. Total Lessons: {stats.lessonCount}.
              </p>
              <div className="mt-4">
                <ProgressBar value={stats.avgScore} label="Overall Mastery" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/app/classroom/${recent.id}`}>
                  <Button size="sm">Resume classroom</Button>
                </Link>
                <Link to={`/app/plan/${recent.id}`}>
                  <Button size="sm" variant="secondary">
                    View plan
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <h2 className="font-display text-xl">No lessons yet</h2>
              <p className="mt-2 text-sm text-slate-600">Start your first lesson to see progress.</p>
              <Link to="/app/learn">
                <Button className="mt-4" size="sm">Create Lesson</Button>
              </Link>
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="font-display text-xl">Learning path</h2>
          <p className="mt-1 text-sm text-slate-600">Generated dynamically based on history.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.recentLessons.slice(0, 4).map((n: any, i: number) => (
              <li key={n.id} className="flex justify-between">
                <span>{n.title || n.topic}</span>
                <Badge tone={i === 0 ? 'indigo' : 'green'}>
                  {i === 0 ? 'current' : 'done'}
                </Badge>
              </li>
            ))}
            {stats.recentLessons.length === 0 && <li className="text-slate-400">Path empty</li>}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-xl">Recent sessions</h2>
        <ul className="mt-4 divide-y border-t">
          {stats.recentLessons.map((h: any) => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-medium">{h.title || h.topic}</p>
                <p className="text-slate-500">
                  {new Date(h.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
          {stats.recentLessons.length === 0 && <p className="py-4 text-center text-slate-500">No sessions recorded yet.</p>}
        </ul>
      </Card>
    </div>
  )
}
