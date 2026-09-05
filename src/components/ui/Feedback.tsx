import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600" role="status">
      <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
      {label}
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <p className="font-display text-lg text-slate-800">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Alert({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'error' | 'warn'
  title: string
  children?: ReactNode
}) {
  const map = {
    info: { icon: Info, cls: 'bg-sky-50 text-sky-900 border-sky-100' },
    success: { icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-900 border-emerald-100' },
    error: { icon: AlertCircle, cls: 'bg-rose-50 text-rose-900 border-rose-100' },
    warn: { icon: AlertCircle, cls: 'bg-amber-50 text-amber-900 border-amber-100' },
  }
  const Icon = map[tone].icon
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 ${map[tone].cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {children && <div className="mt-1 text-sm opacity-90">{children}</div>}
      </div>
    </div>
  )
}
