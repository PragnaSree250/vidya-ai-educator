import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LanguageCode, LearnerProfile, TeacherPersona } from '../types'
import { teachers } from '../data/mock'

const defaultProfile: LearnerProfile = {
  name: '',
  level: 'beginner',
  language: 'en',
  timeBudget: '20m',
}

type Session = {
  profile: LearnerProfile
  teacher: TeacherPersona
  language: LanguageCode
  isAuthed: boolean
  setProfile: (p: LearnerProfile) => void
  setTeacherId: (id: string) => void
  setLanguage: (l: LanguageCode) => void
  login: (name: string) => void
  logout: () => void
}

const Ctx = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<LearnerProfile>(() => {
    const saved = localStorage.getItem('vidya_profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })
  const [teacherId, setTeacherId] = useState('meera')
  const [isAuthed, setAuthedState] = useState(() => localStorage.getItem('vidya_authed') === 'true')

  const teacher = teachers.find((t) => t.id === teacherId) ?? teachers[0]

  const setProfile = (newProfileOrFn: any) => {
    setProfileState((prev: LearnerProfile) => {
      const updated = typeof newProfileOrFn === 'function' ? newProfileOrFn(prev) : newProfileOrFn;
      localStorage.setItem('vidya_profile', JSON.stringify(updated));
      return updated;
    });
  }

  const setAuthed = (val: boolean) => {
    setAuthedState(val);
    localStorage.setItem('vidya_authed', String(val));
  }

  const value = useMemo(
    () => ({
      profile,
      teacher,
      language: profile.language,
      isAuthed,
      setProfile,
      setTeacherId,
      setLanguage: (language: LanguageCode) => setProfile((p: LearnerProfile) => ({ ...p, language })),
      login: (name: string) => {
        setProfile((p: LearnerProfile) => ({ ...p, name }))
        setAuthed(true)
      },
      logout: () => {
        setAuthed(false)
        localStorage.removeItem('vidya_profile')
        localStorage.removeItem('vidya_authed')
        localStorage.removeItem('vidya_token')
      },
    }),
    [profile, teacher, isAuthed],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Session missing')
  return ctx
}
