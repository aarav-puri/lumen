import type { Grade } from '@/lib/food'

// Liquid glass on each step of the logo's spectrum: a tinted body, a bright
// top edge and a soft inner shade, with dark ink for contrast on every tint.
const GLASS = 'text-[#140f2a] shadow-[inset_0_1px_0_rgb(255_255_255/0.75),inset_0_-8px_14px_rgb(20_15_42/0.18),0_6px_18px_-6px_rgb(var(--glow)/0.6)]'
export const GRADE_STYLE: Record<Grade, string> = {
  a: `bg-grade-a [--glow:95_227_208] ${GLASS}`,
  b: `bg-grade-b [--glow:130_196_255] ${GLASS}`,
  c: `bg-grade-c [--glow:139_123_255] ${GLASS}`,
  d: `bg-grade-d [--glow:213_156_255] ${GLASS}`,
  e: `bg-grade-e [--glow:255_179_138] ${GLASS}`,
}

/** A single grade letter on its colour, for lists and tiles. */
export function GradeBadge({ grade, size = 'md', className = '' }: { grade: Grade | null; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const dims = { sm: 'h-6 w-6 text-xs rounded-full', md: 'h-9 w-9 text-base rounded-full', lg: 'h-14 w-14 text-2xl rounded-full' }[size]
  if (!grade) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center border border-dashed border-line tnum text-ink-3 ${dims} ${className}`}>
        <span aria-hidden="true">?</span>
        <span className="sr-only">Not graded</span>
      </span>
    )
  }
  return (
    <span className={`inline-flex shrink-0 items-center justify-center font-semibold uppercase ${GRADE_STYLE[grade]} ${dims} ${className}`}>
      <span aria-hidden="true">{grade}</span>
      <span className="sr-only">Grade {grade.toUpperCase()}</span>
    </span>
  )
}

/** The health score out of 100 on its grade's color, for lists and tiles. */
export function ScoreBadge({ grade, score, size = 'md', className = '' }: { grade: Grade | null; score: number | null; size?: 'sm' | 'md'; className?: string }) {
  const dims = { sm: 'h-6 min-w-[2rem] px-2 text-[11px] rounded-full', md: 'h-9 min-w-[2.75rem] px-2.5 text-sm rounded-full' }[size]
  if (!grade || score === null) return <GradeBadge grade={null} size={size} className={className} />
  return (
    <span className={`tnum inline-flex shrink-0 items-center justify-center font-semibold ${GRADE_STYLE[grade]} ${dims} ${className}`}>
      <span aria-hidden="true">{score}</span>
      <span className="sr-only">Health score {score} out of 100</span>
    </span>
  )
}

/**
 * The score out of 100 on one iridescent glass bar, peach at 0 to teal at 100,
 * with a glass marker where the product sits.
 */
export function ScoreMeter({ grade, score }: { grade: Grade | null; score: number | null }) {
  if (!grade || score === null) {
    return <p className="font-semibold tracking-[-0.03em] text-2xl leading-none text-ink-2">Not scored</p>
  }
  return (
    <div className="w-full">
      <p className="flex items-baseline gap-1.5">
        <span className="tnum font-display text-7xl font-bold leading-none tracking-[-0.03em]">{score}</span>
        <span className="tnum text-sm text-ink-3">/100</span>
      </p>
      <div
        role="meter"
        aria-label="Health score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className="relative mt-5 h-3 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-2px_4px_rgb(0_0_0/0.25)]"
        style={{ background: 'var(--iris-score)' }}
      >
        {/* Dim the part of the scale past the product's score. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 rounded-r-full bg-paper/70"
          style={{ left: `${score}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[inset_0_1px_0_#fff,inset_0_-4px_8px_rgb(20_15_42/0.25),0_0_0_4px_rgb(255_255_255/0.08),0_6px_16px_rgb(0_0_0/0.5)] backdrop-blur"
          style={{ left: `${score}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between tnum text-2xs text-ink-3" aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  )
}
