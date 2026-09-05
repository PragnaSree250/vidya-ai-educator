import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Feedback'
import { getNotes } from '../lib/api'

const fallbackFlashcards = [
  { front: 'What is Ohm’s Law?', back: 'V = I × R (Voltage equals Current times Resistance)' },
  { front: 'What happens to total resistance in a series circuit?', back: 'It increases (R_total = R1 + R2 + ...)' },
  { front: 'What is the unit of electrical current?', back: 'Ampere (A)' },
]

export function FlashcardsPage() {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const [flashcards, setFlashcards] = useState<any[]>(fallbackFlashcards)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotes()
      .then(res => {
        if (res.notes && res.notes.length > 0) {
          setFlashcards(res.notes.map((n: any) => ({ front: `Explain: ${n.title}`, back: n.body })))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8"><Spinner label="Generating flashcards..." /></div>

  const card = flashcards[i]

  return (
    <div className="container-page space-y-6 py-8">
      <h1 className="font-display text-3xl">Flashcards</h1>
      <p className="text-slate-600">
        {i + 1} / {flashcards.length} · Auto-generated from your lessons
      </p>
      <button type="button" className="w-full text-left" onClick={() => setFlip((f) => !f)}>
        <Card className="min-h-[200px] bg-gradient-to-br from-brand-50 to-teal-50">
          <p className="text-xs uppercase text-slate-500">{flip ? 'Answer' : 'Prompt'}</p>
          <p className="mt-6 font-display text-2xl">{flip ? card.back : card.front}</p>
          <p className="mt-6 text-sm text-brand-700">Tap card to flip</p>
        </Card>
      </button>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setI((n) => (n - 1 + flashcards.length) % flashcards.length)
            setFlip(false)
          }}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setI((n) => (n + 1) % flashcards.length)
            setFlip(false)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
