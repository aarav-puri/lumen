'use client'

import type { CSSProperties } from 'react'
import { dietLabel, type FoodProfile } from '@/lib/profile'

/** One full turn of the sweep. Each chip lights up as the sweep's edge passes it. */
const TURN_MS = 3200
const MAX_CHIPS = 6
const FALLBACK = ['Nutrition', 'Ingredients', 'Additives', 'Allergens']

/**
 * The "Checked against you" visual from the landing page, in motion: a sweep
 * turns around the orb and lights each of the person's diets and allergens in
 * turn while the product is being looked up. Decorative; the caller announces
 * the status for screen readers.
 */
export default function ScanCheck({ profile }: { profile: FoodProfile }) {
  const own = [...profile.diets.map(dietLabel), ...profile.avoid]
  const labels = (own.length ? own : FALLBACK).slice(0, MAX_CHIPS)
  // Start a little past twelve o'clock so the top chip does not sit on the sweep's start.
  const offset = 360 / labels.length / 2

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[22rem]">
      {[0.98, 0.72, 0.46].map((s) => (
        <span
          key={s}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
          style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
        />
      ))}

      {/* The sweep: a soft wedge whose leading edge points straight up at 0deg. */}
      <div
        className="scan-sweep absolute inset-[1%] rounded-full"
        style={{ '--turn': `${TURN_MS}ms` } as CSSProperties}
      />

      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_179_138/0.35),rgb(139_123_255/0.2),transparent)] blur-xl" />
      <img
        src="/glass/orb.webp"
        alt=""
        className="scan-orb absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_20px_40px_rgb(139_123_255/0.4)]"
      />

      {labels.map((label, i) => {
        const angle = offset + (360 / labels.length) * i
        const rad = (angle * Math.PI) / 180
        return (
          <span
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + 40 * Math.sin(rad)}%`, top: `${50 - 40 * Math.cos(rad)}%` }}
          >
            <span className="block animate-rise" style={{ animationDelay: `${120 * i}ms` }}>
            <span
              className="glass scan-chip flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-ink-2"
              style={
                {
                  '--turn': `${TURN_MS}ms`,
                  '--hit': `${(angle / 360) * TURN_MS - TURN_MS}ms`,
                } as CSSProperties
              }
            >
              <span className="scan-dot h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="max-w-[8.5rem] truncate">{label}</span>
            </span>
            </span>
          </span>
        )
      })}
    </div>
  )
}
