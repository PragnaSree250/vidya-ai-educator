import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Field'
import { Alert } from '../components/ui/Feedback'
import { useSession } from '../context/SessionContext'
import { login as apiLogin, register as apiRegister } from '../lib/api'

export function LoginPage() {
  const { login } = useSession()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter both email and password.')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const result = await apiLogin({ email, password })
      localStorage.setItem('vidya_token', result.token)
      login(result.user.name)
      nav('/app')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error" title={error} />}
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Continue to classroom'}
        </Button>
        <p className="text-center text-sm text-slate-600">
          New here?{' '}
          <Link className="text-brand-700" to="/signup">
            Create a learner profile
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export function SignupPage() {
  const { login } = useSession()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await apiRegister({ name, email, password })
      localStorage.setItem('vidya_token', result.token)
      login(result.user.name)
      nav('/onboarding')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your learner profile" subtitle="We’ll personalise lessons after a short onboarding.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error" title={error} />}
        <Field label="Full name">
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </Field>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Continue'}
        </Button>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="text-brand-700" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-ink-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div>
          <p className="font-display text-4xl">Teach me Chapter 4 in 20 minutes, in Hindi.</p>
          <p className="mt-4 text-indigo-200">Vidya plans, explains, questions, and adapts — like a real teacher.</p>
        </div>
        <p className="text-sm text-indigo-300">Backed by Gemini and SQLite database</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
