'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { History, LogOut, ScanLine, Settings, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { auth } from '@/lib/supabase'
import Wordmark from '@/components/brand/Wordmark'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/app', label: 'Scan', icon: ScanLine },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

// Set while signing out, so the guard below does not bounce to /signin on the
// way to the home page.
let signingOut = false

/**
 * The frame for every signed-in screen: one header, the same three
 * destinations everywhere (tabs on desktop, a thumb-reach tab bar on phones),
 * and the sign-in guard so no page has to repeat it.
 */
export default function AppShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  const { user, loading, requireSignIn } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && !signingOut) requireSignIn()
  }, [loading, user, requireSignIn])

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-ink-3">
        <Spinner className="h-5 w-5" label="Loading" />
      </div>
    )
  }

  const width = wide ? 'max-w-5xl' : 'max-w-3xl'
  const name: string = user.user_metadata?.display_name || user.email?.split('@')[0] || 'You'

  return (
    <div className="nourish-app min-h-dvh pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-64">
      {/* Desktop: a sidebar with the three destinations and the account. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface-2/60 px-4 py-5 md:flex">
        <Link href="/" aria-label="Nourish home" className="mb-8 self-start rounded-md px-2">
          <Wordmark />
        </Link>
        <nav aria-label="App">
          <ul className="space-y-1">
            {TABS.map((t) => {
              const active = pathname === t.href
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition-colors ${
                      active ? 'bg-surface text-accent-ink shadow-card ring-1 ring-inset ring-line' : 'text-ink-2 hover:bg-surface/70 hover:text-ink'
                    }`}
                  >
                    <t.icon className="h-5 w-5" strokeWidth={active ? 2.1 : 1.8} aria-hidden="true" />
                    {t.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto">
          <AccountMenu user={user} name={name} placement="sidebar" />
        </div>
      </aside>

      {/* Phone: a slim header with the account. */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <div className="flex h-14 items-center justify-between px-[var(--gutter)]">
          <Link href="/" aria-label="Nourish home" className="-m-1 rounded-md p-1">
            <Wordmark />
          </Link>
          <AccountMenu user={user} name={name} placement="header" />
        </div>
      </header>

      <main id="main" className={`mx-auto ${width} px-[var(--gutter)] pb-20 pt-8 md:pt-14`}>
        {children}
      </main>

      {/* Phone tab bar: the three destinations within thumb reach. */}
      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {TABS.map((t) => {
            const active = pathname === t.href
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                    active ? 'text-accent-ink' : 'text-ink-3'
                  }`}
                >
                  <t.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

function AccountMenu({ user, name, placement }: { user: any; name: string; placement: 'sidebar' | 'header' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const signOut = async () => {
    setOpen(false)
    signingOut = true
    try {
      await auth.signOut()
      router.replace('/')
    } catch {
      toast.error('Could not sign out. Try again.')
    } finally {
      setTimeout(() => (signingOut = false), 1000)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account"
        className={
          placement === 'sidebar'
            ? 'flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface/70'
            : 'flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/[0.05]'
        }
      >
        <Avatar user={user} size={placement === 'sidebar' ? 34 : 30} />
        {placement === 'sidebar' && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium capitalize">{name}</span>
            <span className="block truncate text-xs text-ink-3">{user.email}</span>
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 w-64 animate-rise overflow-hidden rounded-2xl bg-surface py-1.5 shadow-pop ring-1 ring-line ${placement === 'sidebar' ? 'bottom-full left-0 mb-2' : 'right-0 top-full mt-2'}`}
        >
          <div className="flex items-center gap-3 border-b border-line px-3.5 py-3">
            <Avatar user={user} size={34} />
            <div className="min-w-0">
              <p className="text-xs text-ink-3">Signed in as</p>
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <div className="py-1">
            <Link
              role="menuitem"
              href="/settings"
              onClick={() => setOpen(false)}
              className="mx-1.5 flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm text-ink-2 hover:bg-ink/[0.05] hover:text-ink"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={signOut}
              className="mx-1.5 flex h-10 w-[calc(100%-0.75rem)] items-center gap-3 rounded-lg px-2.5 text-sm text-ink-2 hover:bg-ink/[0.05] hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
