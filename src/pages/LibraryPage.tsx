import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState, Spinner, Alert } from '../components/ui/Feedback'
import { getMaterials } from '../lib/api'

export function LibraryPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMaterials()
      .then(setMaterials)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <div className="p-8"><Alert tone="error" title={error} /></div>
  if (loading) return <div className="p-8"><Spinner label="Loading library..." /></div>

  return (
    <div className="container-page space-y-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Learning materials</h1>
          <p className="mt-1 text-slate-600">Books, PDFs, notes, slides, and papers. Concepts are extracted for RAG-style grounding.</p>
        </div>
        <Link to="/app/learn">
          <Button>Upload new</Button>
        </Link>
      </div>
      
      {materials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((m) => (
            <Card key={m.id}>
              <Badge tone="slate">{m.type.toUpperCase()}</Badge>
              <h2 className="mt-2 font-display text-xl">{m.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Uploaded {new Date(m.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-3 text-sm text-slate-700">
                Concepts: {m.extractedConcepts.slice(0, 3).join(' · ')}
              </p>
              <Link to="/app/learn">
                <Button className="mt-4" size="sm">
                  Teach from this
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No materials yet"
          body="Upload a PDF or document and Vidya will extract the concepts."
        />
      )}
    </div>
  )
}
