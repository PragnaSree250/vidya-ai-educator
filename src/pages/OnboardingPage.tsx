import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Field, Select, Textarea } from '../components/ui/Field'
import { useSession } from '../context/SessionContext'
import type { LanguageCode, Level, TeachingStyle, TimeBudget } from '../types'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
]

export function OnboardingPage() {
  const { profile, setProfile } = useSession()
  const nav = useNavigate()
  const [step, setStep] = useState(0)

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <p className="text-sm text-brand-700">Step {step + 1} of 2 · learner profile</p>
      <h1 className="mt-2 font-display text-3xl">Help Vidya teach you like a real teacher</h1>

      {step === 0 && (
        <div className="mt-6 space-y-4">
          <Field label="Educational level">
            <Select
              value={profile.level}
              onChange={(e) => setProfile({ ...profile, level: e.target.value as Level })}
            >
              <option value="beginner">Beginner — simple terms & analogies</option>
              <option value="intermediate">Intermediate — technical + examples</option>
              <option value="advanced">Advanced — depth, maths, implementation</option>
            </Select>
          </Field>
          <Field label="Existing knowledge">
            <Textarea
              value={profile.priorKnowledge}
              onChange={(e) => setProfile({ ...profile, priorKnowledge: e.target.value })}
            />
          </Field>
          <Field label="Learning objective">
            <Textarea
              value={profile.objective}
              onChange={(e) => setProfile({ ...profile, objective: e.target.value })}
            />
          </Field>
          <Button onClick={() => setStep(1)}>Next</Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <Field label="Preferred teaching style">
            <Select
              value={profile.style}
              onChange={(e) => setProfile({ ...profile, style: e.target.value as TeachingStyle })}
            >
              <option value="simple">Simple & analogical</option>
              <option value="socratic">Socratic (questions first)</option>
              <option value="exam">Exam preparation</option>
              <option value="story">Story-led</option>
            </Select>
          </Field>
          <Field label="Teaching language">
            <Select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value as LanguageCode })}
            >
              {languages.map((l: { code: string, label: string }) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Time available">
            <Select
              value={profile.timeBudget}
              onChange={(e) => setProfile({ ...profile, timeBudget: e.target.value as TimeBudget })}
            >
              <option value="5m">5 minutes — essentials only</option>
              <option value="20m">20 minutes — structured lesson</option>
              <option value="60m">60 minutes — deep lesson + quiz</option>
              <option value="7d">7 days — plan + revision</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => nav('/app')}>Enter dashboard</Button>
          </div>
        </div>
      )}
    </div>
  )
}
