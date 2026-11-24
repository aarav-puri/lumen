import Link from 'next/link'
import { ReactNode } from 'react'
import Wordmark from '@/components/brand/Wordmark'
import { Phone } from '@/components/home/Phone'

interface AuthShellProps {
  eyebrow: string
  title: string
  lede?: string
  children: ReactNode
  /** The cross link to the other auth page. */
  footer: ReactNode
}

/**
 * The shared frame for sign in and sign up: the form on the left, and on
 * wide screens the thing it unlocks, a Lumen report on a phone.
 */
export default function AuthShell({ eyebrow, title, lede, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <main id="main" className="flex flex-col px-[var(--gutter)] py-5">
        <Link href="/" aria-label="Lumen home" className="self-start rounded-md">
          <Wordmark />
        </Link>

        <div className="mx-auto flex w-full max-w-[24rem] flex-1 flex-col justify-center py-12">
          <p className="t-eyebrow">{eyebrow}</p>
          <h1 className="t-title mt-2">{title}</h1>
          {lede && <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-2">{lede}</p>}
          {children}
          <div className="mt-8 text-sm text-ink-2">{footer}</div>
        </div>
      </main>

      <aside
        aria-hidden="true"
        className="glass relative m-3 hidden flex-col items-center justify-end overflow-hidden rounded-[36px] bg-[radial-gradient(60%_50%_at_50%_75%,rgb(139_123_255/0.2),transparent)] px-10 pt-16 lg:flex"
      >
        <p className="max-w-[14ch] text-balance text-center text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em]">
          The fine print, made clear.
        </p>
        <p className="mt-3 text-center text-ink-3">Every scan, checked against your diet.</p>
        <Phone screen="report" className="-mb-40 mt-12" />
      </aside>
    </div>
  )
}
