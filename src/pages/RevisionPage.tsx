import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Link } from 'react-router-dom'

const days = [
  { d: 'Mon', t: 'Revise Ohm’s Law · 15 min quiz' },
  { d: 'Tue', t: 'Series circuits · 20 min video' },
  { d: 'Wed', t: 'Parallel circuits · diagrams' },
  { d: 'Thu', t: 'Heating effect · problems' },
  { d: 'Fri', t: 'Full chapter mock test' },
  { d: 'Sat', t: 'Weak-concept flashcards' },
  { d: 'Sun', t: 'Rest + concept map review' },
]

export function RevisionPage() {
  return (
    <div className="container-page space-y-6 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-3xl">Revision & exam prep</h1>
        <Badge tone="amber">7-day planner</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {days.map((x) => (
          <Card key={x.d}>
            <p className="text-xs uppercase text-brand-700">{x.d}</p>
            <p className="mt-1 font-medium">{x.t}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="font-display text-xl">Concept map</h2>
        <p className="mt-3 text-center text-sm">
          <span className="rounded-full bg-brand-50 px-3 py-1">Electricity</span>
        </p>
        <p className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
          {['Current', 'Voltage', 'Resistance', 'Ohm', 'Heat'].map((c) => (
            <span key={c} className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
              {c}
            </span>
          ))}
        </p>
        <div className="mt-4 flex gap-2">
          <Link to="/app/classroom/electricity-ch4">
            <Button>Re-teach weak area</Button>
          </Link>
          <Link to="/app/flashcards">
            <Button variant="secondary">Flashcards</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
