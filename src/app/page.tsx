import Link from 'next/link'
import { ArrowRight, Check, Gauge, ListChecks, MessageCircle, ScanText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LabelLens from '@/components/home/LabelLens'
import { Phone, type Screen } from '@/components/home/Phone'
import Reveal from '@/components/21st/reveal'
import { NumberTicker } from '@/components/21st/number-ticker'

const STATS = [
  { value: 73, suffix: '%', claim: 'of the U.S. packaged food supply is ultra-processed', source: 'Nature Communications, 2023' },
  { value: 12, suffix: '%', claim: 'of U.S. adults have proficient health literacy', source: 'National Assessment of Adult Literacy' },
  { value: 32, suffix: '', claim: 'adverse health outcomes linked to ultra-processed food', source: 'The BMJ, 2024' },
]

const STEPS = [
  { title: 'Scan the barcode', body: 'Use your camera, a photo, or type the number. Nourish looks it up in Open Food Facts.' },
  { title: 'See the score', body: 'A score out of 100, the sugar, fat and salt levels, and how processed it is.' },
  { title: 'Check it against you', body: 'Nourish flags anything that does not fit your diet or the allergens you avoid.' },
]

type Feature = {
  icon: LucideIcon
  title: string
  body: string
  points: string[]
  visual: { screen: Screen } | 'lens'
}

const FEATURES: Feature[] = [
  {
    icon: Gauge,
    title: 'A score you can read at a glance',
    body: 'Every product gets a score out of 100, built on the Nutri-Score. You see what pulls it down, like high sugar or saturated fat, without studying the nutrition table.',
    points: ['Sugar, fat and salt marked low, medium or high', 'Processing level from 1 to 4', 'Scored per 100g for food and per 100ml for drinks'],
    visual: { screen: 'report' },
  },
  {
    icon: ListChecks,
    title: 'Checked against the way you eat',
    body: 'Tell Nourish the diets you follow and the allergens or ingredients you avoid, once. Every scan after that tells you whether it fits, and why.',
    points: ['15 diets, from vegetarian to halal and kosher', 'Common allergens, plus any ingredient you add', '“May contain” warnings flagged too'],
    visual: { screen: 'profile' },
  },
  {
    icon: ScanText,
    title: 'Every additive, in plain words',
    body: 'E120 and E471 are hard to judge from a label. Nourish gives each additive its plain name and lists the allergens a product contains.',
    points: ['Plain names for every E number', 'Allergens and traces listed separately', 'Type in a label when a product is missing'],
    visual: 'lens',
  },
  {
    icon: MessageCircle,
    title: 'Ask about your own cupboard',
    body: 'Nourish AI answers questions using the products you have scanned, like which snack has the least sugar or what to swap first.',
    points: ['Answers come from your scan history', 'Runs on your own Google Gemini key', 'Optional. Scores work without it'],
    visual: { screen: 'chat' },
  },
]

const FAQ = [
  { q: 'Is Nourish free?', a: 'Yes. Scanning, scores, profile checks and your history are free, with no ads.' },
  {
    q: 'Do I need an AI key?',
    a: 'Only for Nourish AI. Everything else works without one. To use the chat, paste your own Google Gemini key in Settings. It is stored in your browser, not on our servers.',
  },
  {
    q: 'Which barcodes can it read?',
    a: 'EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39 and QR codes, from your camera, a photo, a pasted image, or the number itself.',
  },
  {
    q: 'Does it replace reading the label?',
    a: 'No. Nourish is a guide, not medical advice. If you have a serious allergy, always read the package yourself.',
  },
  {
    q: 'What happens to my scans?',
    a: 'They are saved to your account so you can find them in History and ask Nourish AI about them. You can delete your account and its data in Settings.',
  },
]

function Frame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[32px] bg-surface-2 p-3 ring-1 ring-inset ring-line sm:p-4 ${className}`}>{children}</div>
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        {/* ============ Hero ============ */}
        <section aria-labelledby="hero-h" className="px-[var(--gutter)] pb-20 pt-16 text-center sm:pt-24">
          <Reveal>
            <h1 id="hero-h" className="t-display mx-auto max-w-[15ch] text-balance">
              The fine print, <span className="text-accent-ink">made clear.</span>
            </h1>
          </Reveal>
          <Reveal index={1}>
            <p className="mx-auto mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-ink-3 sm:text-xl sm:leading-relaxed">
              Scan any barcode to get a health score, see how processed it is, and check it against your diet and allergies.
            </p>
            <div className="mt-9 flex justify-center">
              <Link href="/signup" className="btn-primary h-12 px-7">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal index={2} className="mx-auto mt-16 max-w-5xl">
            <Frame className="overflow-hidden">
              <picture>
                <source media="(prefers-color-scheme: dark)" srcSet="/screens/desktop-dark.jpg" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screens/desktop-light.jpg"
                  alt="Nourish on a computer: the report for Nutella, with a health score of 8 out of 100 and a warning that it does not fit your profile"
                  width={1280}
                  height={800}
                  className="block h-auto w-full rounded-[22px] shadow-lift ring-1 ring-line"
                />
              </picture>
            </Frame>
          </Reveal>
        </section>

        {/* ============ Why ============ */}
        <section aria-labelledby="why-h" className="border-t border-line bg-surface px-[var(--gutter)] py-24">
          <div className="mx-auto max-w-5xl">
            <h2 id="why-h" className="sr-only">
              Why it matters
            </h2>
            <dl className="grid gap-12 text-center md:grid-cols-3 md:gap-8">
              {STATS.map((s) => (
                <div key={s.claim}>
                  <dt className="sr-only">{s.claim}</dt>
                  <dd>
                    <span className="tnum block font-display text-6xl font-bold tracking-[-0.03em]">
                      <NumberTicker target={s.value} />
                      {s.suffix}
                    </span>
                    <span className="mx-auto mt-3 block max-w-[17rem] text-lg leading-snug text-ink-2">{s.claim}</span>
                    <span className="mt-2 block text-sm text-ink-3">{s.source}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <Reveal className="mx-auto mt-20 max-w-3xl">
              <figure className="rounded-[28px] bg-surface-2 px-8 py-10 text-center ring-1 ring-inset ring-line sm:px-14">
                <blockquote className="font-display text-[1.375rem] font-medium leading-relaxed tracking-[-0.01em] sm:text-2xl sm:leading-relaxed">
                  “My dad is vegetarian, and I kept noticing how often packaged food quietly includes things that do not fit. I wanted a scan
                  to tell us, instantly.”
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-3">
                  <span className="font-semibold text-ink">Aarav Puri</span>, founder.{' '}
                  <Link href="/about" className="font-medium text-accent-ink underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
                    Read the story
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ============ How it works ============ */}
        <section id="how" aria-labelledby="how-h" className="scroll-mt-20 border-t border-line px-[var(--gutter)] py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p className="t-eyebrow">How it works</p>
            <h2 id="how-h" className="t-title mt-3">
              Three steps to a clear answer
            </h2>
            <p className="mt-3 text-lg text-ink-3">No squinting at the back of the pack. Just scan.</p>

            <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative">
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-3rem)] bg-line-strong/70 md:block" />
                  )}
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 font-display text-xl font-bold text-accent-ink ring-1 ring-inset ring-line">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-[-0.015em]">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[18rem] leading-relaxed text-ink-3">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ Features ============ */}
        <section id="features" aria-label="Features" className="scroll-mt-20 border-t border-line bg-surface-2/40 px-[var(--gutter)] py-24">
          <div className="mx-auto max-w-5xl space-y-28">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
                    <f.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h2 className="t-title mt-6">{f.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink-3">{f.body}</p>
                  <ul className="mt-6 space-y-3">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-ink-2">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-accent-ink" strokeWidth={2.5} aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal index={1}>
                  {f.visual === 'lens' ? (
                    <Frame className="p-6 sm:p-8">
                      <LabelLens />
                    </Frame>
                  ) : (
                    <Frame className="flex justify-center overflow-hidden px-6 pt-10 sm:px-6 sm:pt-12">
                      <Phone screen={f.visual.screen} className="-mb-28" />
                    </Frame>
                  )}
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" aria-labelledby="faq-h" className="scroll-mt-20 border-t border-line px-[var(--gutter)] py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="t-eyebrow">Questions</p>
              <h2 id="faq-h" className="t-title mt-3">
                Frequently asked
              </h2>
            </div>
            <dl className="mt-14 grid gap-4 md:grid-cols-2">
              {FAQ.map((f) => (
                <div key={f.q} className="card p-7">
                  <dt className="font-display text-lg font-bold tracking-[-0.01em]">{f.q}</dt>
                  <dd className="mt-3 leading-relaxed text-ink-3">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============ Start ============ */}
        <section aria-labelledby="start-h" className="border-t border-line bg-surface px-[var(--gutter)] py-28 text-center">
          <h2 id="start-h" className="t-display mx-auto max-w-[14ch] text-balance">
            What’s in your <span className="text-accent-ink">cupboard?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-lg text-ink-3">Scan your first product for free.</p>
          <Link href="/signup" className="btn-primary mt-9 h-12 px-7">
            Get started free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
