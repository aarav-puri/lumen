'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight,
  Camera,
  Columns2,
  ListChecks,
  MessageCircle,
  ScanLine,
  Search,
  Share,
  WifiOff,
} from 'lucide-react'
import Reveal from '@/components/21st/reveal'
import { NumberTicker } from '@/components/21st/number-ticker'
import { Phone, type Screen } from '@/components/home/Phone'
import { Float, ScrollHighlight, SpotlightCard, Typewriter } from '@/components/home/motion'
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

/* ---------- Hero headline: letters rise into focus, then color sweeps through the last words ---------- */

/** The glass objects' palette: lavender, peach, mint. */
const SWEEP = [
  [178, 156, 255],
  [255, 179, 138],
  [95, 227, 208],
]

function sweepColor(t: number) {
  const seg = Math.min(SWEEP.length - 2, Math.floor(t * (SWEEP.length - 1)))
  const local = t * (SWEEP.length - 1) - seg
  const [a, b] = [SWEEP[seg], SWEEP[seg + 1]]
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * local))
  return `rgb(${c[0]} ${c[1]} ${c[2]})`
}

const PUNCT = /[,.]/

function HeroHeadline({ text, highlight = 2 }: { text: string; highlight?: number }) {
  const reduce = useReducedMotion()

  const words = text.split(' ')
  const firstLit = words.length - highlight
  const litCount = words.slice(firstLit).join('').replace(PUNCT, '').length

  const line = (layer: 'base' | 'color') => {
    let n = 0
    let lit = 0
    return words.map((w, wi) => (
      <span key={wi} className={`inline-block whitespace-nowrap ${layer === 'color' && wi < firstLit ? 'invisible' : ''}`}>
        {w.split('').map((ch, ci) => {
          const i = n++
          const punct = PUNCT.test(ch)
          const cls = `inline-block ${punct ? 'hero-punct' : ''}`
          if (layer === 'base') {
            return (
              <motion.span
                key={ci}
                className={cls}
                initial={reduce ? false : { opacity: 0, y: '0.45em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.028, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            )
          }
          const color = wi >= firstLit && !punct ? sweepColor(lit++ / Math.max(1, litCount - 1)) : undefined
          return (
            <span key={ci} className={cls} style={{ color }}>
              {ch}
            </span>
          )
        })}
        {wi < words.length - 1 ? '\u00a0' : ''}
      </span>
    ))
  }

  return (
    <span aria-label={text} className="relative block">
      <span aria-hidden="true">{line('base')}</span>
      {!reduce && (
        <span aria-hidden="true" className="hero-sweep pointer-events-none absolute inset-0">
          {line('color')}
        </span>
      )}
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
      <h1 id="hero-h" className="t-hero relative mx-auto max-w-[12ch] text-balance text-center text-[#d4d4dc]">
        <HeroHeadline text="The fine print, made clear" />
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
  return <SpotlightCard className={className}>{children}</SpotlightCard>
}

function Bento() {
  const [answered, setAnswered] = useState(false)
  return (
    <section id="features" aria-labelledby="bento-h" className="scroll-mt-24 px-[var(--gutter)] pb-28 pt-40">
      <div className="mx-auto max-w-6xl">
        <h2 id="bento-h" className="t-title mx-auto max-w-[16ch] text-balance text-center text-[#d4d4dc]">
          <BlurWords text="Know what you are buying." />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg leading-relaxed text-ink-2">
          <ScrollHighlight text="Lumen reads the label for you: a score out of 100, how processed it is, every additive in plain words, and whether it fits the way you eat." />
        </p>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12 [&>*]:min-w-0">
          {/* History */}
          <Reveal className="lg:col-span-4">
            <Card className="h-full p-6">
              <h3 className="t-heading">Every scan, saved</h3>
              <p className="mt-2 text-ink-3">Find anything you have scanned, sorted by date and searchable by name.</p>
              <ul className="mt-8 space-y-2">
                {SAMPLE_SCANS.map((s, i) => (
                  <motion.li
                    key={s.name}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: i === 2 ? 0.4 : 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${i === 0 ? 'iris-ring bg-white/[0.04]' : ''}`}
                  >
                    <span className={`tnum flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg text-sm font-semibold ${GRADE_STYLE[s.grade]}`}>{s.score}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{s.name}</span>
                      <span className="block truncate text-xs text-ink-3">{s.brand}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {/* Ways to scan */}
          <Reveal index={1} className="lg:col-span-3">
            <Card className="flex h-full flex-col p-6">
              <Float className="relative -mt-4 mx-auto w-48" distance={6}>
                <img src={glass('barcode')} alt="" aria-hidden="true" className="w-full drop-shadow-[0_24px_48px_rgb(178_156_255/0.35)]" />
                <span aria-hidden="true" className="scan-line" />
              </Float>
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
                {[0.98, 0.72, 0.46].map((s, i) => (
                  <span key={s} aria-hidden="true" className="ring-pulse absolute rounded-full border border-white/[0.07]" style={{ width: `${s * 100}%`, height: `${s * 100}%`, animationDelay: `${i * 0.5}s` }} />
                ))}
                <div aria-hidden="true" className="absolute h-1/2 w-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_179_138/0.35),rgb(139_123_255/0.2),transparent)] blur-xl" />
                <Float className="relative w-[38%]" distance={10} duration={6}>
                  <img src={glass('orb')} alt="" aria-hidden="true" className="w-full drop-shadow-[0_20px_40px_rgb(139_123_255/0.4)]" />
                </Float>
                {[
                  { t: 'Vegetarian', c: 'Fits', x: '6%', y: '14%', tone: 'text-level-low' },
                  { t: 'Tree nuts', c: 'Contains', x: '58%', y: '6%', tone: 'text-level-high' },
                  { t: 'Low sugar', c: 'Check', x: '64%', y: '76%', tone: 'text-level-moderate' },
                  { t: 'Halal', c: 'Fits', x: '0%', y: '70%', tone: 'text-level-low' },
                ].map((c, i) => (
                  <motion.span
                    key={c.t}
                    initial={{ opacity: 0, scale: 0.6, y: 12 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.35 + i * 0.15 }}
                    className="glass absolute flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ left: c.x, top: c.y }}
                  >
                    {c.t}
                    <span className={c.tone}>{c.c}</span>
                  </motion.span>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Ask Lumen AI */}
          <Reveal index={1} className="lg:col-span-7">
            <Card className="grid h-full items-center gap-6 p-6 sm:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="iris-ring flex h-12 items-center gap-3 rounded-full bg-[#0d0d10] pl-5 pr-1.5">
                  <Typewriter text="Which of my snacks has the least sugar?" onDone={() => setAnswered(true)} className="flex-1 truncate text-sm text-ink" />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06]">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                  animate={answered ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 pl-5 text-sm text-ink-3"
                >
                  The almonds you scanned on Tuesday, at 4.4g per 100g.
                </motion.p>
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
  { icon: ScanLine, title: 'Scan it in the aisle.', body: 'Point your camera at any barcode. Lumen finds the product and reads the whole label.', screen: 'scan' },
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
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-2">
                      <ScrollHighlight text={s.body} />
                    </p>
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

/**
 * Pinned horizontal scroll: the section sticks to the screen and scrolling
 * down moves the cards sideways. The page carries on after the last card.
 */
function Carousel() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (p) => -p * distance)
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={section}
      aria-labelledby="new-h"
      className="relative border-t border-white/[0.06]"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-[var(--gutter)]">
          <h2 id="new-h" className="t-title max-w-[14ch] text-[#d4d4dc]">
            <BlurWords text="Built for how you shop." />
          </h2>
          <div aria-hidden="true" className="mb-3 hidden h-px w-40 overflow-hidden rounded-full bg-white/10 sm:block">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gradient-to-r from-[#b29cff] to-[#ffb38a]" />
          </div>
        </div>
        <motion.div
          ref={track}
          style={{ x, paddingInline: 'max(var(--gutter), calc((100vw - 72rem) / 2 + var(--gutter)))' }}
          className="mt-12 flex w-max gap-4"
        >
          {NEW.map((n) => (
            <SpotlightCard key={n.title} className="flex w-[85vw] max-w-[34rem] shrink-0 flex-col">
              <div className="flex h-60 items-center justify-center bg-[radial-gradient(ellipse_at_50%_60%,rgb(139_123_255/0.12),transparent_70%)] px-6 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                {n.visual}
              </div>
              <div className="p-6 pt-2">
                <h3 className="t-heading flex items-center gap-2">
                  <n.icon className="h-5 w-5 text-accent" />
                  {n.title}
                </h3>
                <p className="mt-2 text-ink-3">{n.body}</p>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>
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
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-4 block text-lg leading-snug text-ink-2"
                  >
                    {s.claim}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.75 + i * 0.12 }}
                    className="mt-3 block text-sm text-ink-3"
                  >
                    {s.source}
                  </motion.span>
                </dd>
              </Card>
            </Reveal>
          ))}
        </dl>
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <figure>
            <blockquote className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-snug tracking-[-0.025em] text-[#d4d4dc]">
              <ScrollHighlight text="“My dad is vegetarian, and I kept noticing how often packaged food quietly includes things that do not fit. I wanted a scan to tell us, instantly.”" />
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-3">
              <span className="text-ink">Aarav Puri</span>, founder.{' '}
              <Link href="/about" className="text-accent-ink underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
                Read the story
              </Link>
            </figcaption>
          </figure>
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
      <Closing />
    </>
  )
}

