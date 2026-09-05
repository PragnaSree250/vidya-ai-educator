import { useState, type ReactNode } from 'react'
import { Volume2 } from 'lucide-react'

export function TeacherStage({
  name,
  speaking,
  caption,
}: {
  name: string
  speaking: boolean
  caption: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-950 via-indigo-950 to-slate-900 p-5 text-white">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`overflow-hidden h-24 w-24 rounded-full bg-slate-900 border-4 ${
              speaking ? 'border-sun-400/70' : 'border-white/10'
            }`}
          >
            {speaking ? (
               <video 
                  src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-40150-large.mp4" 
                  autoPlay loop muted playsInline 
                  className="h-full w-full object-cover" 
               />
            ) : (
               <div className="h-full w-full grid place-items-center bg-gradient-to-br from-brand-500 to-teal-500 text-3xl font-display">
                  {name[0]}
               </div>
            )}
          </div>
          {speaking && (
            <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-1 animate-pulse rounded-full bg-sun-400"
                  style={{ height: 8 + i * 4, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-200">AI teacher · live voice</p>
          <p className="font-display text-2xl">{name}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-indigo-200">
            <Volume2 className="h-3.5 w-3.5" /> Natural speech · mock playback
          </p>
        </div>
      </div>
      <p className="mt-5 rounded-xl bg-white/10 p-3 text-sm leading-relaxed text-indigo-50">{caption}</p>
    </div>
  )
}

export function Whiteboard({ kind }: { kind: string }) {
  const [showAlt, setShowAlt] = useState(false)

  if (kind === 'equation') {
    return (
      <Board title="Mathematics / Physics · formula">
        <p className="font-display text-4xl tracking-wide">V = I × R</p>
        <p className="mt-3 text-sm text-slate-600">If V is constant and R increases, I must fall.</p>
        <button className="mt-3 text-sm text-brand-700 underline" onClick={() => setShowAlt((s) => !s)}>
          {showAlt ? 'Hide graph' : 'Show current vs resistance'}
        </button>
        {showAlt && (
          <svg viewBox="0 0 200 80" className="mt-2 w-full text-brand-600">
            <path d="M10 10 v60 h180" fill="none" stroke="#94a3b8" />
            <path d="M20 18 Q 80 70 190 70" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        )}
      </Board>
    )
  }

  if (kind === 'code') {
    return (
      <Board title="Programming · execution flow">
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-300">
{`function current(v, r) {
  return v / r; // Ohm
}
current(6, 3) // → 2`}
        </pre>
      </Board>
    )
  }

  if (kind === 'timeline') {
    return (
      <Board title="History · timeline">
        <div className="flex gap-3 overflow-x-auto text-xs">
          {['1752 · Franklin', '1827 · Ohm', '1831 · Faraday'].map((e) => (
            <div key={e} className="min-w-[120px] rounded-lg bg-amber-50 p-2 text-amber-900">
              {e}
            </div>
          ))}
        </div>
      </Board>
    )
  }

  if (kind === 'biology') {
    return (
      <Board title="Biology · labeled structure">
        <div className="grid place-items-center">
          <div className="relative h-28 w-28 rounded-full border-4 border-emerald-400 bg-emerald-50">
            <div className="absolute left-8 top-8 h-10 w-10 rounded-full bg-emerald-600" />
          </div>
          <p className="mt-2 text-xs text-slate-500">Nucleus · cytoplasm (illustrative)</p>
        </div>
      </Board>
    )
  }

  return (
    <Board title="Physics · circuit diagram">
      <svg viewBox="0 0 260 90" className="w-full">
        <rect x="20" y="30" width="28" height="28" fill="none" stroke="#4F46E5" strokeWidth="2" />
        <text x="24" y="48" fontSize="10" fill="#4F46E5">
          6V
        </text>
        <line x1="48" y1="44" x2="120" y2="44" stroke="#0f172a" strokeWidth="2" />
        <path d="M120 44 l8 -10 l8 20 l8 -20 l8 20 l8 -10" fill="none" stroke="#0D9488" strokeWidth="2" />
        <text x="128" y="72" fontSize="11" fill="#0D9488">
          R
        </text>
        <line x1="168" y1="44" x2="230" y2="44" stroke="#0f172a" strokeWidth="2" />
        <line x1="230" y1="44" x2="230" y2="70" stroke="#0f172a" strokeWidth="2" />
        <line x1="34" y1="58" x2="34" y2="70" stroke="#0f172a" strokeWidth="2" />
        <line x1="34" y1="70" x2="230" y2="70" stroke="#0f172a" strokeWidth="2" />
      </svg>
      <p className="text-sm text-slate-600">Same voltage, tighter “pipe” (R) → smaller current.</p>
    </Board>
  )
}

function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      {children}
    </div>
  )
}
