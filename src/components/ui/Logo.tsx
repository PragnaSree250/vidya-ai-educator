export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-xl tracking-tight">
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-semibold text-white ${
          light ? 'bg-white/20' : 'bg-brand-600'
        }`}
      >
        V
      </span>
      <span className={light ? 'text-white' : 'text-ink-900'}>
        Vidya<span className="text-brand-500">.</span>
      </span>
    </span>
  )
}
