import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useSession } from '../context/SessionContext'
import { getLesson } from '../lib/api'
import { Spinner, Alert } from '../components/ui/Feedback'

const typeTone = {
  intro: 'indigo',
  explain: 'teal',
  demonstrate: 'amber',
  question: 'rose',
  adapt: 'green',
  assess: 'slate',
} as const

export function PlanPage() {
  const { profile } = useSession()
  const { id } = useParams()
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      getLesson(id)
        .then(setPlan)
        .catch(e => setError(e.message))
    }
  }, [id])

  if (error) return <div className="p-8"><Alert tone="error" title="Error">{error}</Alert></div>
  if (!plan) return <div className="p-8"><Spinner label="Loading lesson plan..." /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <Badge>AI-generated structure</Badge>
        <h1 className="mt-2 font-display text-3xl">{plan.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Level: {plan.level || profile.level}. Time: {plan.timeBudget || profile.timeBudget}. Teaching in {plan.language || profile.language}.
          Visual plan: {plan.visualsPlan}
        </p>
      </div>

      <ol className="space-y-3">
        {plan.steps?.map((s: any, i: number) => (
          <Card key={s.id || i}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  Step {i + 1} · {s.durationMin} min · visual: {s.visual}
                </p>
                <p className="font-display text-xl">{s.title}</p>
                <p className="mt-2 text-sm text-slate-700">
                  {s.script}
                </p>
              </div>
              <Badge tone={typeTone[s.type as keyof typeof typeTone] || 'slate'}>{s.type}</Badge>
            </div>
          </Card>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        <Link to={`/app/classroom/${plan.id}`}>
          <Button>Enter AI classroom</Button>
        </Link>
        <Link to="/app/learn">
          <Button variant="secondary">Adjust brief</Button>
        </Link>
      </div>
    </div>
  )
}
