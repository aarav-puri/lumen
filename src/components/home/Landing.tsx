'use client'

/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  ClipboardPaste,
  Columns2,
  ListChecks,
  MessageCircle,
  Mic,
  ScanLine,
  Search,
  Share,
  WifiOff,
} from 'lucide-react'
import Reveal from '@/components/21st/reveal'
import { NumberTicker } from '@/components/21st/number-ticker'
import { Phone, type Screen } from '@/components/home/Phone'
import { GRADE_STYLE } from '@/components/product/Grade'
import type { Grade } from '@/lib/food'

const glass = (n: 'barcode' | 'leaf' | 'orb') => `/glass/${n}.webp`

/* ---------- Headline that comes into focus word by word ---------- */

export function BlurWords({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <span aria-label={text} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={reduce ? false : { opacity: 0, filter: 'blur(14px)', y: '0.15em' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  )
}

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120])
  const leafY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -260])
  const barY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -200])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -320])

  return (
    <section ref={ref} aria-labelledby="hero-h" className="relative overflow-hidden px-[var(--gutter)] pt-20 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-24 h-[34rem] w-[64rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_123_255/0.22),transparent)] blur-2xl" />
      <h1 id="hero-h" className="t-display relative mx-auto max-w-[12ch] text-balance text-center text-[#d4d4dc]">
        <BlurWords text="The fine print, made clear." />
      </h1>

      <div className="relative mx-auto mt-10 flex max-w-5xl justify-center sm:mt-14">
        <motion.img
          src={glass('leaf')}
          alt=""
          aria-hidden="true"
          style={{ y: leafY }}
          initial={{ opacity: 0, scale: 0.85, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-16 hidden w-44 drop-shadow-[0_30px_60px_rgb(139_123_255/0.35)] md:block lg:left-8 lg:w-56"
        />
        <motion.img
          src={glass('barcode')}
          alt=""
          aria-hidden="true"
          style={{ y: barY }}
          initial={{ opacity: 0, scale: 0.85, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={{ duration: 1.1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-0 hidden w-48 drop-shadow-[0_30px_60px_rgb(255_179_138/0.3)] md:block lg:right-6 lg:w-60"
        />
        <motion.img
          src={glass('orb')}
          alt=""
          aria-hidden="true"
          style={{ y: orbY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 right-16 hidden w-28 drop-shadow-[0_20px_40px_rgb(95_227_208/0.3)] lg:block"
        />
        <motion.div
          style={{ y: phoneY }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(178_156_255/0.25),transparent)] blur-2xl" />
          <Phone screen="report" priority className="relative -mb-40" />
        </motion.div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-paper via-paper/90 to-transparent" />
    </section>
  )
}

/* ---------- Bento: know what you're buying ---------- */

const SAMPLE_SCANS: { name: string; brand: string; grade: Grade; score: number }[] = [
  { name: 'Plain Greek yogurt', brand: 'Fage', grade: 'a', score: 84 },
  { name: 'Oat and honey granola', brand: 'Nature Valley', grade: 'c', score: 46 },
  { name: 'Hazelnut spread', brand: 'Nutella', grade: 'e', score: 8 },
]

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative overflow-hidden glass rounded-[28px] ${className}`}>{children}</div>
}

function Bento() {
  return (
    <section id="features" aria-labelledby="bento-h" className="scroll-mt-24 px-[var(--gutter)] pb-28 pt-40">
      <div className="mx-auto max-w-6xl">
        <h2 id="bento-h" className="t-title mx-auto max-w-[16ch] text-balance text-center text-[#d4d4dc]">
          <BlurWords text="Know what you are buying." />
        </h2>
        <Reveal>
          <p className="mx-auto mt-5 max-w-xl text-center text-lg leading-relaxed text-ink-3">
            Lumen reads the label for you: a score out of 100, how processed it is, every additive in plain words, and whether it fits the way you eat.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12 [&>*]:min-w-0">
          {/* History */}
          <Reveal className="lg:col-span-4">
            <Card className="h-full p-6">
              <h3 className="t-heading">Every scan, saved</h3>
              <p className="mt-2 text-ink-3">Find anything you have scanned, sorted by date and searchable by name.</p>
              <ul className="mt-8 space-y-2">
                {SAMPLE_SCANS.map((s, i) => (
                  <li
                    key={s.name}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${i === 0 ? 'iris-ring bg-white/[0.04]' : ''} ${i === 2 ? 'opacity-40' : ''}`}
                  >
                    <span className={`tnum flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg text-sm font-semibold ${GRADE_STYLE[s.grade]}`}>{s.score}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{s.name}</span>
                      <span className="block truncate text-xs text-ink-3">{s.brand}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {/* Ways to scan */}
          <Reveal index={1} className="lg:col-span-3">
            <Card className="flex h-full flex-col p-6">
              <img src={glass('barcode')} alt="" aria-hidden="true" className="-mt-4 mx-auto w-48 drop-shadow-[0_24px_48px_rgb(178_156_255/0.35)]" />
              <h3 className="t-heading mt-auto">Scan it any way</h3>
              <p className="mt-2 text-ink-3">Camera, a photo, a pasted screenshot, or the number under the bars.</p>
            </Card>
          </Reveal>

          {/* Checked against you */}
          <Reveal index={2} className="lg:col-span-5 lg:row-span-2">
            <Card className="flex h-full min-h-[26rem] flex-col p-6">
              <h3 className="t-heading">Checked against you</h3>
              <p className="mt-2 max-w-sm text-ink-3">Save your diets and the allergens you avoid once. Every scan after that is checked for you.</p>
              <div className="relative mx-auto mt-6 flex aspect-square w-full max-w-[22rem] flex-1 items-center justify-center">
                {[0.98, 0.72, 0.46].map((s) => (
                  <span key={s} aria-hidden="true" className="absolute rounded-full border border-white/[0.07]" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
                ))}
                <div aria-hidden="true" className="absolute h-1/2 w-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_179_138/0.35),rgb(139_123_255/0.2),transparent)] blur-xl" />
                <img src={glass('orb')} alt="" aria-hidden="true" className="relative w-[38%] drop-shadow-[0_20px_40px_rgb(139_123_255/0.4)]" />
                {[
                  { t: 'Vegetarian', c: 'Fits', x: '6%', y: '14%', tone: 'text-level-low' },
                  { t: 'Tree nuts', c: 'Contains', x: '58%', y: '6%', tone: 'text-level-high' },
                  { t: 'Low sugar', c: 'Check', x: '64%', y: '76%', tone: 'text-level-moderate' },
                  { t: 'Halal', c: 'Fits', x: '0%', y: '70%', tone: 'text-level-low' },
                ].map((c) => (
                  <span
                    key={c.t}
                    className="glass absolute flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ left: c.x, top: c.y }}
                  >
                    {c.t}
                    <span className={c.tone}>{c.c}</span>
                  </span>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Ask Lumen AI */}
          <Reveal index={1} className="lg:col-span-7">
            <Card className="grid h-full items-center gap-6 p-6 sm:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="iris-ring flex h-12 items-center gap-3 rounded-full bg-[#0d0d10] pl-5 pr-1.5">
                  <span className="flex-1 truncate text-sm text-ink">Which of my snacks has the least sugar?</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06]">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 pl-5 text-sm text-ink-3">The almonds you scanned on Tuesday, at 4.4g per 100g.</p>
              </div>
              <div>
                <h3 className="t-heading">Ask Lumen AI</h3>
                <p className="mt-2 text-ink-3">Questions about your own cupboard, answered from what you have scanned.</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Story: statements beside a sticky phone ---------- */

const STORY: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; screen: Screen }[] = [
  { icon: ScanLine, title: 'Scan it in the aisle.', body: 'Point your camera at any barcode. Lumen finds the product in Open Food Facts and reads the whole label.', screen: 'scan' },
  { icon: ListChecks, title: 'One number for the whole label.', body: 'A score out of 100 built on the Nutri-Score, with sugar, fat and salt marked low, medium or high.', screen: 'report' },
  { icon: Search, title: 'Checked against the way you eat.', body: 'Fifteen diets, the common allergens, and any ingredient you add yourself, flagged on every scan.', screen: 'profile' },
  { icon: MessageCircle, title: 'Ask about your own cupboard.', body: 'Lumen AI answers from your scan history, on your own Gemini key.', screen: 'chat' },
]

function Story() {
  return (
    <section id="how" aria-label="How Lumen works" className="scroll-mt-24 border-t border-white/[0.06] px-[var(--gutter)] py-24">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_1fr]">
        <ol className="space-y-[28vh] py-[10vh]">
          {STORY.map((s) => (
            <li key={s.title}>
              <Reveal>
                <div className="flex items-start gap-6">
                  <span className="iris-glow mt-1 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#121218] ring-1 ring-white/10">
                    <s.icon className="h-5 w-5 text-ink" />
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#d4d4dc]">{s.title}</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-3">{s.body}</p>
                  </div>
                </div>
              </Reveal>
              <div className="mt-10 flex justify-center lg:hidden">
                <Phone screen={s.screen} />
              </div>
            </li>
          ))}
        </ol>
        <StickyPhone />
      </div>
    </section>
  )
}

function StickyPhone() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const screens = STORY.map((s) => s.screen)
  return (
    <div ref={ref} className="relative hidden lg:block">
      <div className="sticky top-[12vh] flex h-[76vh] items-center justify-center">
        <div aria-hidden="true" className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(139_123_255/0.2),transparent)] blur-2xl" />
        <div className="relative">
          {screens.map((sc, i) => (
            <StickyLayer key={sc} index={i} total={screens.length} progress={scrollYProgress}>
              <Phone screen={sc} />
            </StickyLayer>
          ))}
        </div>
      </div>
    </div>
  )
}

function StickyLayer({ children, index, total, progress }: { children: React.ReactNode; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const step = 1 / total
  const start = index * step
  const opacity = useTransform(progress, [start - 0.015, start + 0.015, start + step - 0.015, start + step + 0.015], [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0])
  return (
    <motion.div style={{ opacity }} className={index === 0 ? 'relative' : 'absolute inset-0'}>
      {children}
    </motion.div>
  )
}

/* ---------- Carousel: what is new ---------- */

const NEW = [
  {
    icon: Search,
    title: 'Everything, one shortcut away.',
    body: 'Press Command K to jump to any page or any product you have scanned.',
    visual: (
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#0d0d10] p-2 ring-1 ring-white/10 iris-glow">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 pb-2.5 pt-1.5 text-sm text-ink-3">
          <Search className="h-4 w-4" /> granola
          <kbd className="ml-auto rounded bg-surface-3 px-1.5 text-[10px]">⌘K</kbd>
        </div>
        {['Oat and honey granola', 'Granola bar, dark chocolate'].map((t, i) => (
          <div key={t} className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${i === 0 ? 'bg-white/[0.06] text-ink' : 'text-ink-3'}`}>
            <span className={`tnum grid h-6 w-7 place-items-center rounded-md text-[11px] font-semibold ${GRADE_STYLE[i === 0 ? 'c' : 'd']}`}>{i === 0 ? 46 : 31}</span>
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Columns2,
    title: 'Two products, side by side.',
    body: 'Pick any two scans and see which has less sugar, less salt, and fits you better.',
    visual: (
      <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-2 text-sm">
        {[
          ['Greek yogurt', 84, 'a', '3.2g'],
          ['Fruit yogurt', 41, 'c', '13.8g'],
        ].map(([n, s, g, sug], i) => (
          <div key={n as string} className={`rounded-2xl bg-[#0d0d10] p-4 ring-1 ring-white/10 ${i === 0 ? 'iris-ring' : ''}`}>
            <span className={`tnum grid h-8 w-10 place-items-center rounded-lg text-sm font-semibold ${GRADE_STYLE[g as Grade]}`}>{s as number}</span>
            <p className="mt-3 font-medium">{n as string}</p>
            <p className="tnum mt-1 text-xs text-ink-3">Sugars {sug as string}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Share,
    title: 'Share what you found.',
    body: 'Turn any report into a clean card for your messages or your story.',
    visual: <img src={glass('leaf')} alt="" aria-hidden="true" className="mx-auto w-40 drop-shadow-[0_24px_48px_rgb(255_179_138/0.35)]" />,
  },
  {
    icon: WifiOff,
    title: 'Works offline.',
    body: 'Add Lumen to your Home Screen. Your past scans stay readable with no signal.',
    visual: <img src={glass('orb')} alt="" aria-hidden="true" className="mx-auto w-32 drop-shadow-[0_24px_48px_rgb(95_227_208/0.3)]" />,
  },
]

function Carousel() {
  const track = useRef<HTMLDivElement>(null)
  const move = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section aria-labelledby="new-h" className="border-t border-white/[0.06] py-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-[var(--gutter)]">
        <h2 id="new-h" className="t-title max-w-[14ch] text-[#d4d4dc]">
          <BlurWords text="Built for how you shop." />
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Previous" className="btn-icon bg-white/[0.04] ring-1 ring-inset ring-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next" className="btn-icon bg-white/[0.04] ring-1 ring-inset ring-white/10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: 'max(var(--gutter), calc((100vw - 72rem) / 2 + var(--gutter)))', scrollPaddingInline: 'max(var(--gutter), calc((100vw - 72rem) / 2 + var(--gutter)))' }}
      >
        {NEW.map((n) => (
          <article key={n.title} className="flex w-[85vw] max-w-[34rem] shrink-0 snap-start flex-col glass rounded-[28px]">
            <div className="flex h-60 items-center justify-center bg-[radial-gradient(ellipse_at_50%_60%,rgb(139_123_255/0.12),transparent_70%)] px-6">{n.visual}</div>
            <div className="p-6 pt-2">
              <h3 className="t-heading flex items-center gap-2">
                <n.icon className="h-5 w-5 text-accent" />
                {n.title}
              </h3>
              <p className="mt-2 text-ink-3">{n.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- Why: stats and the founder ---------- */

const STATS = [
  { value: 73, suffix: '%', claim: 'of the U.S. packaged food supply is ultra-processed', source: 'Nature Communications, 2023' },
  { value: 12, suffix: '%', claim: 'of U.S. adults have proficient health literacy', source: 'National Assessment of Adult Literacy' },
  { value: 32, suffix: '', claim: 'adverse health outcomes linked to ultra-processed food', source: 'The BMJ, 2024' },
]

function Why() {
  return (
    <section aria-labelledby="why-h" className="border-t border-white/[0.06] px-[var(--gutter)] py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="why-h" className="t-title mx-auto max-w-[16ch] text-center text-[#d4d4dc]">
          <BlurWords text="The label will not tell you." />
        </h2>
        <dl className="mt-16 grid gap-4 md:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.claim} index={i}>
              <Card className="h-full p-7">
                <dt className="sr-only">{s.claim}</dt>
                <dd>
                  <span className="tnum iris-text block font-display text-7xl font-extrabold tracking-[-0.05em]">
                    <NumberTicker target={s.value} />
                    {s.suffix}
                  </span>
                  <span className="mt-4 block text-lg leading-snug text-ink-2">{s.claim}</span>
                  <span className="mt-3 block text-sm text-ink-3">{s.source}</span>
                </dd>
              </Card>
            </Reveal>
          ))}
        </dl>
        <Reveal className="mx-auto mt-20 max-w-3xl text-center">
          <figure>
            <blockquote className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-snug tracking-[-0.025em] text-[#d4d4dc]">
              “My dad is vegetarian, and I kept noticing how often packaged food quietly includes things that do not fit. I wanted a scan to tell us, instantly.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-3">
              <span className="text-ink">Aarav Puri</span>, founder.{' '}
              <Link href="/about" className="text-accent-ink underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
                Read the story
              </Link>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Free ---------- */

function Free() {
  return (
    <section aria-labelledby="free-h" className="relative overflow-hidden border-t border-white/[0.06] px-[var(--gutter)] py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 id="free-h" className="t-title max-w-[12ch] text-[#d4d4dc]">
            <BlurWords text="Free. No ads. Yours." />
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-3">Everything in Lumen is free to use, with nothing to unlock and nothing to sell you.</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Camera, t: 'Unlimited scans', b: 'Scan as much as you shop.' },
              { icon: WifiOff, t: 'Installable', b: 'Add it to your Home Screen.' },
              { icon: Mic, t: 'Your own AI key', b: 'Stored in your browser only.' },
              { icon: ClipboardPaste, t: 'Missing a product?', b: 'Type the label in yourself.' },
            ].map((f, i) => (
              <Reveal key={f.t} index={i % 2}>
                <f.icon className="h-5 w-5 text-accent" />
                <p className="mt-3 font-display text-lg font-bold tracking-[-0.015em]">{f.t}</p>
                <p className="mt-1 text-ink-3">{f.b}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="relative mx-auto h-[26rem] w-full max-w-md">
          <div className="absolute inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(139_123_255/0.3),rgb(255_179_138/0.12),transparent)] blur-2xl" />
          <img src={glass('leaf')} alt="" className="absolute left-0 top-0 w-64 -rotate-12" />
          <img src={glass('barcode')} alt="" className="absolute bottom-6 right-0 w-56 rotate-6" />
          <img src={glass('orb')} alt="" className="absolute bottom-0 left-10 w-28" />
        </div>
      </div>
    </section>
  )
}

/* ---------- Closing card ---------- */

function Closing() {
  return (
    <section aria-labelledby="start-h" className="px-[var(--gutter)] pb-24 pt-8">
      <Reveal className="mx-auto max-w-6xl">
        <Card className="grid items-end gap-10 overflow-hidden px-8 pt-12 sm:px-14 lg:grid-cols-[1.2fr_1fr]">
          <div aria-hidden="true" className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(139_123_255/0.35),transparent)] blur-2xl" />
          <div className="relative pb-14">
            <p className="t-eyebrow">Start in seconds</p>
            <h2 id="start-h" className="mt-3 font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[#d4d4dc]">
              What is in your cupboard?
            </h2>
            <p className="mt-4 max-w-sm text-lg text-ink-3">Create an account and scan your first product. It is free.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary h-12 px-7">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/signin" className="btn-secondary h-12 px-7">
                Sign in
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <Phone screen="scan" className="-mb-48" />
          </div>
        </Card>
      </Reveal>
    </section>
  )
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Bento />
      <Story />
      <Carousel />
      <Why />
      <Free />
      <Closing />
    </>
  )
}

