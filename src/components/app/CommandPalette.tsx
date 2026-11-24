'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Camera, Columns2, History, Leaf, MessageCircle, ScanLine, Search, Settings, KeyRound } from 'lucide-react'
import { useScans } from '@/lib/scans'
import { ScoreBadge } from '@/components/product/Grade'

/** Opens the palette from anywhere: dispatch this event, or press Cmd/Ctrl+K. */
export const OPEN_PALETTE = 'lumen:open-palette'
export const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE))

const NAV = [
  { label: 'Scan', hint: 'Camera, photo or number', href: '/app', icon: ScanLine },
  { label: 'History', hint: 'Everything you have scanned', href: '/history', icon: History },
  { label: 'Compare', hint: 'Two products, side by side', href: '/compare', icon: Columns2 },
  { label: 'Settings', hint: 'Account and preferences', href: '/settings', icon: Settings },
]

const ACTIONS = [
  { label: 'Scan with camera', href: '/app?camera=1', icon: Camera },
  { label: 'Edit food profile', href: '/settings#profile', icon: Leaf },
  { label: 'Ask Lumen AI', href: '/history?ask=1', icon: MessageCircle },
  { label: 'Gemini API key', href: '/settings#key', icon: KeyRound },
]

/**
 * Cmd+K: jump to any page, action or past scan. Search matches product
 * names, brands and barcodes. Built on cmdk.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { entries } = useScans()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE, onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  // A full barcode typed in: offer to look it up directly.
  const digits = search.replace(/\D/g, '')
  const looksLikeCode = digits.length >= 8 && digits.length === search.replace(/\s/g, '').length

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      shouldFilter
      // Plain "contains" matching on every word typed: predictable, unlike fuzzy.
      filter={(value, search) => {
        const v = value.toLowerCase()
        return search.toLowerCase().split(/\s+/).filter(Boolean).every((w) => v.includes(w)) ? 1 : 0
      }}
      overlayClassName="fixed inset-0 z-[180] bg-black/60 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[12vh] z-[190] w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-[22px] bg-surface shadow-[0_30px_120px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10 iris-glow"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5">
        <Search className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search scans, pages and actions"
          className="h-14 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
        />
        <kbd className="hidden shrink-0 rounded-md bg-surface-3 px-1.5 py-0.5 text-[11px] text-ink-3 sm:block">esc</kbd>
      </div>
      <Command.List className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ink-3">
        <Command.Empty className="px-3 py-10 text-center text-sm text-ink-3">No matches.</Command.Empty>

        {looksLikeCode && (
          <Command.Group heading="Barcode">
            <Item value={`lookup ${digits}`} onSelect={() => go(`/app?code=${digits}`)} icon={ScanLine} label={`Look up ${digits}`} />
          </Command.Group>
        )}

        <Command.Group heading="Go to">
          {NAV.map((n) => (
            <Item key={n.href} value={`${n.label} ${n.hint}`} onSelect={() => go(n.href)} icon={n.icon} label={n.label} hint={n.hint} />
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          {ACTIONS.map((a) => (
            <Item key={a.href} value={a.label} onSelect={() => go(a.href)} icon={a.icon} label={a.label} />
          ))}
        </Command.Group>

        {entries && entries.length > 0 && (
          <Command.Group heading="Your scans">
            {entries.slice(0, 60).map((e) => (
              <Command.Item
                key={e.barcode}
                value={`${e.food.name} ${e.food.brand ?? ''} ${e.barcode}`}
                onSelect={() => go(`/app?code=${e.food.barcode}`)}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-2 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink"
              >
                <ScoreBadge grade={e.food.grade} score={e.food.score} size="sm" />
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium text-ink">{e.food.name}</span>
                  {e.food.brand && <span className="text-ink-3"> · {e.food.brand}</span>}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
      <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-2.5 text-[11px] text-ink-3">
        <span>Lumen</span>
        <span className="flex items-center gap-3">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
        </span>
      </div>
    </Command.Dialog>
  )
}

function Item({
  value,
  onSelect,
  icon: Icon,
  label,
  hint,
}: {
  value: string
  onSelect: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  hint?: string
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-2 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink"
    >
      <Icon className="h-4 w-4 shrink-0 text-ink-3" />
      <span className="font-medium text-ink">{label}</span>
      {hint && <span className="ml-auto truncate text-xs text-ink-3">{hint}</span>}
    </Command.Item>
  )
}
