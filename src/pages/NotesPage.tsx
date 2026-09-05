import { notes } from '../data/mock'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/Feedback'

export function NotesPage() {
  return (
    <div className="container-page space-y-6 py-8">
      <h1 className="font-display text-3xl">Automatic notes</h1>
      <p className="text-slate-600">Generated after each lesson. Ready for a future notes API.</p>
      {notes.map((n) => (
        <Card key={n.title}>
          <h2 className="font-display text-xl">{n.title}</h2>
          <p className="mt-2 text-slate-700">{n.body}</p>
        </Card>
      ))}
      <EmptyState
        title="Homework inbox is empty"
        body="Personalised homework will appear here after the next assessment."
        action={<Button variant="secondary">Request practice set (mock)</Button>}
      />
    </div>
  )
}
