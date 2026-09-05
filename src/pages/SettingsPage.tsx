import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { Card } from '../components/ui/Card'
import { Field, Input, Select } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Feedback'
import type { Level } from '../types'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
]

export function SettingsPage() {
  const { profile, setProfile, logout } = useSession()
  const nav = useNavigate()
  const [saved, setSaved] = useState(false)

  return (
    <div className="container-page max-w-2xl space-y-6 py-8">
      <h1 className="font-display text-3xl">Settings</h1>
      {saved && <Alert tone="success" title="Saved locally in this prototype (no server)." />}
      <Card>
        <h2 className="font-display text-xl">Accessibility</h2>
        <p className="mt-2 text-sm text-slate-600">
          High-contrast classroom, captions under the avatar, and large tap targets are on by default.
        </p>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked /> Captions always on
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked /> Reduce motion on avatar ring
        </label>
      </Card>
      <Card className="space-y-4">
        <Field label="Display name">
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </Field>
        <Field label="Default level">
          <Select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </Field>
        <Field label="Default language">
          <Select
            value={profile.language}
            onChange={(e) => setProfile({ ...profile, language: e.target.value as typeof profile.language })}
          >
            {languages.map((l: { code: string, label: string }) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={() => setSaved(true)}>Save preferences</Button>
        <Button
          variant="ghost"
          onClick={() => {
            logout()
            nav('/')
          }}
        >
          Sign out
        </Button>
      </Card>
    </div>
  )
}
