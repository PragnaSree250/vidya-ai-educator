import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { getDashboard } from '../lib/api'
import { Spinner, Alert } from '../components/ui/Feedback'

export function PathPage() {
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
  if (loading || !stats) return <div className="p-8"><Spinner label="Loading path..." /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <h1 className="font-display text-3xl">Learning path</h1>
        <p className="mt-1 text-slate-600">
          Topics become a sequence. Vidya adapts your learning path dynamically.
        </p>
      </div>
      <ol className="space-y-3">
        {stats.recentLessons.map((n: any, i: number) => (
          <Card key={n.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Module {i + 1}</p>
                <p className="font-display text-xl">{n.topic || n.title}</p>
                <p className="text-sm text-slate-500">Completed on {new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={i === 0 ? 'indigo' : 'green'}>
                  {i === 0 ? 'current' : 'done'}
                </Badge>
                <Link to={`/app/classroom/${n.id}`}>
                  <Button size="sm" variant={i === 0 ? 'primary' : 'secondary'}>
                    {i === 0 ? 'Continue' : 'Revise'}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {stats.recentLessons.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            No lessons in your path yet.
          </div>
        )}
      </ol>
    </div>
  )
}
