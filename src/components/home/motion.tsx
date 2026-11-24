'use client'

/**
 * Small motion pieces for the landing page. Everything here settles to its
 * final state when the visitor prefers reduced motion.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'

/* ---------- Text that starts faded and lights up word by word as you scroll ---------- */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="transition-none">
      {children}
    </motion.span>
  )
}

export function ScrollHighlight({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.5'] })
  const words = text.split(' ')
  if (reduce) return <span className={className}>{text}</span>
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w + (i < words.length - 1 ? ' ' : '')}
        </Word>
      ))}
    </span>
  )
}

/* ---------- A card that tilts toward the cursor, with a light that follows it,
   a lit edge, and a slow light travelling round its border ---------- */

const TILT = 5 // degrees at the card's edge
const SPRING = { stiffness: 180, damping: 18, mass: 0.6 }

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const id = useId()
  // A stable per-card offset so the border lights do not all move in step.
  const offset = -([...id].reduce((n, c) => n + c.charCodeAt(0), 0) % 9)

  const rx = useSpring(0, SPRING)
  const ry = useSpring(0, SPRING)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (reduce || e.pointerType !== 'mouse') return
    // Larger cards tilt less, so wide panels stay calm.
    const k = Math.min(1, 420 / Math.max(r.width, r.height))
    ry.set(((x / r.width) * 2 - 1) * TILT * k)
    rx.set(-((y / r.height) * 2 - 1) * TILT * k)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`spotlight group relative overflow-hidden glass rounded-[28px] ${className}`}
    >
      {children}
      <div aria-hidden="true" className="spotlight-fill pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="spotlight-orbit pointer-events-none absolute inset-0 rounded-[inherit]" style={{ animationDelay: `${offset}s` }} />
      <div aria-hidden="true" className="spotlight-edge pointer-events-none absolute inset-0 rounded-[inherit]" />
    </motion.div>
  )
}

/* ---------- Typing text, for the Lumen AI question ---------- */

export function Typewriter({ text, onDone, className = '' }: { text: string; onDone?: () => void; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(text.length)
      onDone?.()
      return
    }
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      i++
      setN(i)
      if (i < text.length) t = setTimeout(tick, 38)
      else onDone?.()
    }
    t = setTimeout(tick, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, text])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!reduce && n < text.length && <span aria-hidden="true" className="caret ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-ink" />}
    </span>
  )
}

/* ---------- Gentle float, for the glass objects inside cards ---------- */

export function Float({ children, className = '', distance = 8, duration = 5, delay = 0 }: { children: ReactNode; className?: string; distance?: number; duration?: number; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
