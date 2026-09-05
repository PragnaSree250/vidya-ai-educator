import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState, Spinner, Alert } from '../components/ui/Feedback'
import { getNotes } from '../lib/api'

export function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getNotes()
      .then(res => setNotes(res.notes))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8"><Spinner label="Loading notes..." /></div>
  if (error) return <div className="p-8"><Alert tone="error" title={error} /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <h1 className="font-display text-3xl">Automatic notes</h1>
      <p className="text-slate-600">Generated dynamically from your completed lessons.</p>
      
      {notes.length === 0 && (
        <EmptyState
          title="No notes yet"
          body="Complete a lesson first. Vidya will automatically extract the core concepts and summaries here."
          action={
            <Link to="/app/learn">
              <Button variant="secondary">Start a lesson</Button>
            </Link>
          }
        />
      )}

      {notes.map((n: { id: string, title: string, body: string }) => (
        <Card key={n.id}>
          <h2 className="font-display text-xl">{n.title}</h2>
          <p className="mt-2 text-slate-700">{n.body}</p>
          <div className="mt-4 flex justify-end">
             <Link to="/app/flashcards">
                <Button size="sm" variant="secondary">Generate Practice Flashcards</Button>
             </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
