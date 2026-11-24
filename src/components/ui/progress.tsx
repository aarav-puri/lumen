/**
 * A progress bar: a track pressed into the clay with the filled part raised
 * along it. Pure markup with the progressbar role, so it needs no library.
 */
export function Progress({ value, label, className = '' }: { value: number; label?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={`relative h-3 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
