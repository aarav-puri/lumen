import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="px-[var(--gutter)] pb-24 pt-28 sm:pt-36">
        <article className="mx-auto max-w-3xl">
          <p className="t-eyebrow">About</p>
          <h1 className="t-display mt-3 text-balance">Built from a personal problem.</h1>

          <div className="mt-10">
            <div>
              <p className="font-medium">Aarav Puri</p>
              <a
                href="https://aaravpuri.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-ink-2 underline decoration-ink/30 underline-offset-4 hover:text-ink"
              >
                aaravpuri.org
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="prose-lumen mt-10 text-[1.0625rem] leading-8">
            <p className="!mb-8 font-display text-2xl font-semibold leading-snug tracking-[-0.02em] text-ink">Lumen started with my dad.</p>
            <p>
              My dad is vegetarian, and I kept noticing how much effort went into figuring out whether he could eat
              something. Even with everyday groceries, ingredients weren&rsquo;t always straightforward. Something that
              looked completely fine could contain an animal-derived ingredient hidden behind an unfamiliar name.
            </p>
            <p>
              It made me wonder why something so simple had to be so complicated. Why couldn&rsquo;t my dad just scan a
              product and immediately know whether it was right for him?
            </p>
            <p>So I built something that could do exactly that.</p>
            <p>
              As I developed Lumen, I realized it could help far beyond my own family. I wanted to understand more about
              the food I was eating, too. What was actually in it? What did those unfamiliar ingredients mean? Were there
              other options that better suited my needs?
            </p>
            <p>
              Those questions shaped Lumen. With a single scan, you can see what&rsquo;s in your food, check whether it
              fits the way you eat, and compare it with other products to find a better option.
            </p>
          </div>

          <div className="mt-14 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold tracking-[-0.03em] text-xl">Try it on whatever is in your kitchen.</p>
            <Link href="/app" className="btn-primary group h-12 px-6">
              Start scanning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
