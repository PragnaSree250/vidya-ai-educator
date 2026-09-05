import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-card ${padding ? 'p-5 sm:p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
