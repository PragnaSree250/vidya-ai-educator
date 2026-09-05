import { teachers } from '../data/mock'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useSession } from '../context/SessionContext'

export function TeachersPage() {
  const { teacher, setTeacherId } = useSession()
  return (
    <div className="container-page space-y-6 py-8">
      <h1 className="font-display text-3xl">AI teacher characters</h1>
      <p className="text-slate-600">Same lesson, different personality, voice colour, and questioning style.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {teachers.map((t) => (
          <Card key={t.id}>
            <div className={`mb-4 h-16 w-16 rounded-full bg-gradient-to-br ${t.accent} text-white grid place-items-center font-display text-2xl`}>
              {t.name[0]}
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl">{t.name}</h2>
              {teacher.id === t.id && <Badge>Active</Badge>}
            </div>
            <p className="text-sm text-slate-500">{t.title}</p>
            <p className="mt-2 text-sm text-slate-700">{t.style}</p>
            <p className="mt-2 text-xs text-slate-500">Languages: {t.languages.join(', ').toUpperCase()}</p>
            <Button className="mt-4" size="sm" variant={teacher.id === t.id ? 'secondary' : 'primary'} onClick={() => setTeacherId(t.id)}>
              {teacher.id === t.id ? 'Selected' : 'Teach with ' + t.name}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
