'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Wordmark from '@/components/brand/Wordmark'

const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${
        scrolled || open
          ? 'border-white/[0.06] bg-paper/70 backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="relative mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-[var(--gutter)]">
        <Link href="/" aria-label="Lumen home" className="rounded-md">
          <Wordmark byline />
        </Link>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                className="inline-flex h-9 items-center rounded-full px-3.5 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="btn-icon md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
          <div className="flex items-center gap-2" aria-busy={loading || undefined}>
            {user ? (
              <Link href="/app" className="btn-primary h-10 min-h-10 gap-1 pl-5 pr-4 text-sm">
                Open Lumen
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link href="/signin" className="hidden h-10 items-center px-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink sm:inline-flex">
                  Sign in
                </Link>
                <Link href="/signup" className="btn-primary h-10 min-h-10 gap-1 pl-5 pr-4 text-sm">
                  Get started
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div id="mobile-nav" hidden={!open} className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 flex flex-col bg-paper md:hidden">
        <ul className="flex-1 px-[var(--gutter)] pt-2">
          {NAV.map((l, i) => (
            <li key={l.href} className="animate-rise border-b border-line" style={{ animationDelay: `${i * 40}ms` }}>
              <Link href={l.href} onClick={() => setOpen(false)} className="flex h-16 items-center font-display text-3xl font-bold tracking-[-0.02em]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
