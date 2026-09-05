export function Badge({
  children,
  tone = 'indigo',
}: {
  children: React.ReactNode
  tone?: 'indigo' | 'teal' | 'amber' | 'slate' | 'rose' | 'green'
}) {
  const tones = {
    indigo: 'bg-brand-50 text-brand-700',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-sun-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    rose: 'bg-rose-50 text-rose-700',
    green: 'bg-emerald-50 text-emerald-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
