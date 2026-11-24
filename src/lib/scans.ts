'use client'

import { useCallback, useEffect, useState } from 'react'
import { db } from '@/lib/supabase'
import { toFood, type Food } from '@/lib/food'
import { productCache } from '@/lib/scan-cache'

/** One product in the person's history, however many times it was scanned. */
export interface ScanEntry {
  barcode: string
  food: Food
  lastScanned: string
  times: number
}

// A copy of the raw history rows, so History and the command palette open
// instantly and still work with no connection.
const OFFLINE_KEY = 'lumen:scans:v1'

export function readCachedRows(): any[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(OFFLINE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeCachedRows(rows: any[]) {
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(rows.slice(0, 200)))
  } catch {
    // Storage full or blocked: the cache is a convenience, not a requirement.
  }
}

export function clearCachedRows() {
  try {
    localStorage.removeItem(OFFLINE_KEY)
  } catch {}
}

/** Collapse raw history rows into one entry per product, newest first. */
export function toEntries(rows: any[]): ScanEntry[] {
  const byCode = new Map<string, ScanEntry>()
  for (const row of rows) {
    const key = row.barcode || row.id
    const existing = byCode.get(key)
    if (existing) {
      existing.times += 1
      continue
    }
    const food = toFood(row.product_data, row.barcode)
    productCache.set(food.barcode, food)
    byCode.set(key, { barcode: key, food, lastScanned: row.scanned_at, times: 1 })
  }
  return Array.from(byCode.values())
}

/**
 * Fetch history rows, falling back to the on-device copy when offline.
 * `offline` is true when what you are seeing came from that copy.
 */
export async function loadRows(limit = 500): Promise<{ rows: any[]; offline: boolean }> {
  try {
    const rows = (await db.getScannedProducts(limit)) ?? []
    writeCachedRows(rows)
    return { rows, offline: false }
  } catch (err) {
    const cached = readCachedRows()
    if (cached) return { rows: cached, offline: true }
    throw err
  }
}

/** The person's scans as entries, for the palette and Compare. */
export function useScans() {
  const [entries, setEntries] = useState<ScanEntry[] | null>(() => {
    const cached = readCachedRows()
    return cached ? toEntries(cached) : null
  })
  const [offline, setOffline] = useState(false)

  const refresh = useCallback(() => {
    loadRows()
      .then(({ rows, offline }) => {
        setEntries(toEntries(rows))
        setOffline(offline)
      })
      .catch(() => setEntries((e) => e ?? []))
  }, [])

  useEffect(refresh, [refresh])
  return { entries, offline, refresh }
}
