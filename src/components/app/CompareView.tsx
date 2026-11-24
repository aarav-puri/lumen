'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'
import PageHeader from '@/components/app/PageHeader'
import { ScoreBadge } from '@/components/product/Grade'
import { useAuth } from '@/lib/auth-context'
import { useScans, type ScanEntry } from '@/lib/scans'
import { GRADE_INFO, NOVA_INFO, fmt, type Food } from '@/lib/food'
import { checkProduct, isProfileEmpty, overallStatus, type CheckStatus } from '@/lib/profile'

type Better = 'lower' | 'higher'
type Row = { label: string; get: (f: Food) => number | null | undefined; unit?: string; digits?: number; better: Better; show?: (f: Food) => string }

const ROWS: Row[] = [
  { label: 'Health score', get: (f) => f.score, better: 'higher', show: (f) => (f.score === null ? 'Not scored' : `${f.score}/100`) },
  { label: 'Processing', get: (f) => f.nova, better: 'lower', show: (f) => (f.nova ? `${NOVA_INFO[f.nova].label} (${f.nova} of 4)` : 'Unknown') },
  { label: 'Energy', get: (f) => f.nutrition.energyKcal, unit: ' kcal', digits: 0, better: 'lower' },
  { label: 'Sugars', get: (f) => f.nutrition.sugars, unit: 'g', better: 'lower' },
  { label: 'Saturated fat', get: (f) => f.nutrition.saturatedFat, unit: 'g', better: 'lower' },
  { label: 'Salt', get: (f) => f.nutrition.salt, unit: 'g', digits: 2, better: 'lower' },
  { label: 'Fiber', get: (f) => f.nutrition.fiber, unit: 'g', better: 'higher' },
  { label: 'Protein', get: (f) => f.nutrition.protein, unit: 'g', better: 'higher' },
]

const FIT: Record<CheckStatus, { label: string; rank: number; tone: string }> = {
  ok: { label: 'Fits', rank: 3, tone: 'text-level-low' },
  unknown: { label: 'Some unknowns', rank: 2, tone: 'text-ink-2' },
  caution: { label: 'Check the package', rank: 1, tone: 'text-level-moderate' },
  conflict: { label: 'Does not fit', rank: 0, tone: 'text-level-high' },
}

function winner(row: Row, a: Food, b: Food): 'a' | 'b' | null {
  const x = row.get(a)
  const y = row.get(b)
  if (x == null || y == null || x === y) return null
  return (row.better === 'higher' ? x > y : x < y) ? 'a' : 'b'
}

function Picker({ entries, value, onChange, label }: { entries: ScanEntry[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field h-12 cursor-pointer appearance-none pr-10 font-medium">
        <option value="">Choose a product</option>
        {entries.map((e) => (
          <option key={e.barcode} value={e.food.barcode}>
            {e.food.name}
            {e.food.brand ? `, ${e.food.brand}` : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

export function CompareView() {
  const params = useSearchParams()
  const { entries } = useScans()
  const { profile } = useAuth()
  const [a, setA] = useState(params.get('a') ?? '')
  const [b, setB] = useState(params.get('b') ?? '')

  const list = entries ?? []
  const foodA = useMemo(() => list.find((e) => e.food.barcode === a)?.food, [list, a])
  const foodB = useMemo(() => list.find((e) => e.food.barcode === b)?.food, [list, b])
  const profileEmpty = isProfileEmpty(profile)

  const fit = (f: Food) => FIT[overallStatus(checkProduct(f, profile)) ?? 'ok']

  const verdict = useMemo(() => {
    if (!foodA || !foodB) return null
    let wa = 0
    let wb = 0
    for (const r of ROWS) {
      const w = winner(r, foodA, foodB)
      if (w === 'a') wa++
      if (w === 'b') wb++
    }
    if (!profileEmpty) {
      const fa = fit(foodA).rank
      const fb = fit(foodB).rank
      if (fa !== fb) return fa > fb ? `${foodA.name} fits your profile better.` : `${foodB.name} fits your profile better.`
    }
    if (wa === wb) return 'These two are close. Look at what matters most to you below.'
    const [name, n] = wa > wb ? [foodA.name, wa] : [foodB.name, wb]
    return `${name} comes out ahead on ${n} of ${ROWS.length} measures.`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodA, foodB, profile, profileEmpty])

  return (
    <>
      <PageHeader title="Compare." subtitle="Pick two products you have scanned and see which is the better choice." />

      {entries === null ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
      ) : list.length < 2 ? (
        <div className="card p-8 text-center">
          <p className="font-display text-xl font-bold tracking-[-0.02em]">Scan two products to compare them</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-3">You have {list.length === 0 ? 'no scans' : 'one scan'} so far.</p>
          <Link href="/app" className="btn-primary mt-6">
            Scan a product
          </Link>
        </div>
      ) : (
        <>
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <Picker entries={list} value={a} onChange={setA} label="First product" />
            <button
              type="button"
              onClick={() => {
                setA(b)
                setB(a)
              }}
              aria-label="Swap products"
              className="btn-icon mx-auto ring-1 ring-inset ring-white/10"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Picker entries={list} value={b} onChange={setB} label="Second product" />
          </div>

          {foodA && foodB && (
            <section aria-label="Comparison" className="mt-8">
              <p className="iris-ring rounded-2xl bg-surface px-5 py-4 font-display text-lg font-bold tracking-[-0.015em]">{verdict}</p>

              <div className="card mt-4 overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr] gap-px bg-white/[0.06] sm:grid-cols-[11rem_1fr_1fr]">
                  <div className="hidden bg-surface sm:block" />
                  {[foodA, foodB].map((f) => (
                    <div key={f.barcode} className="flex items-start gap-3 bg-surface p-4 sm:p-5">
                      <ScoreBadge grade={f.grade} score={f.score} />
                      <div className="min-w-0">
                        <p className="truncate text-xs text-ink-3">{f.brand ?? ' '}</p>
                        <Link href={`/app?code=${f.barcode}`} className="line-clamp-2 font-display font-bold leading-tight tracking-[-0.015em] hover:underline">
                          {f.name}
                        </Link>
                        {f.grade && <p className="mt-1 text-xs text-ink-3">{GRADE_INFO[f.grade].label}</p>}
                      </div>
                    </div>
                  ))}

                  {ROWS.map((r) => {
                    const w = winner(r, foodA, foodB)
                    return (
                      <Cells
                        key={r.label}
                        label={r.label}
                        values={[foodA, foodB].map((f) => {
                          const v = r.get(f)
                          return r.show ? r.show(f) : v == null ? 'Not listed' : `${fmt(v, r.digits ?? 1)}${r.unit ?? ''}`
                        })}
                        win={w}
                      />
                    )
                  })}

                  {!profileEmpty && (
                    <Cells
                      label="Your profile"
                      values={[foodA, foodB].map((f) => fit(f).label)}
                      tones={[fit(foodA).tone, fit(foodB).tone]}
                      win={fit(foodA).rank === fit(foodB).rank ? null : fit(foodA).rank > fit(foodB).rank ? 'a' : 'b'}
                    />
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-3">Nutrition per 100g, or per 100ml for drinks. The better value in each row is highlighted.</p>
            </section>
          )}
        </>
      )}
    </>
  )
}

function Cells({ label, values, win, tones }: { label: string; values: string[]; win: 'a' | 'b' | null; tones?: string[] }) {
  return (
    <>
      <div className="col-span-2 bg-surface px-4 pb-0 pt-3 text-xs font-medium text-ink-3 sm:col-span-1 sm:flex sm:items-center sm:px-5 sm:py-3.5 sm:text-sm">{label}</div>
      {values.map((v, i) => {
        const isWin = (win === 'a' && i === 0) || (win === 'b' && i === 1)
        return (
          <div key={i} className={`tnum bg-surface px-4 py-3 text-[0.9375rem] sm:px-5 sm:py-3.5 ${isWin ? 'font-semibold text-ink' : 'text-ink-2'} ${tones?.[i] ?? ''}`}>
            <span className={isWin ? 'rounded-md bg-accent-soft px-2 py-0.5 text-accent-ink' : ''}>{v}</span>
          </div>
        )
      })}
    </>
  )
}
