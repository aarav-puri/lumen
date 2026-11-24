/**
 * An iPhone-style frame around a real screenshot of Nourish. Screens live in
 * public/screens as `<name>-light.jpg` and `<name>-dark.jpg`, captured at
 * 390 x 783 (2x), and follow the visitor's light or dark setting.
 */
export type Screen = 'scan' | 'report' | 'profile' | 'chat'

const ALT: Record<Screen, string> = {
  scan: 'The Nourish scanner, with a large Scan with camera button',
  report: 'A Nourish report for Nutella: health score 8 out of 100, and a red banner saying it does not fit your profile',
  profile: 'The food profile, with the diets you follow and the allergens you avoid',
  chat: 'Nourish AI, offering questions to ask about your scans',
}

export function Phone({ screen, className = '', priority = false }: { screen: Screen; className?: string; priority?: boolean }) {
  return (
    <div
      className={`relative w-[288px] shrink-0 rounded-[52px] bg-[#111113] p-[11px] shadow-[0_50px_100px_-40px_rgb(16_24_20/0.45)] ring-1 ring-black/10 ${className}`}
    >
      <div className="relative overflow-hidden rounded-[42px] bg-paper">
        <div className="relative h-[44px]" aria-hidden="true">
          <span className="absolute left-1/2 top-2.5 h-[28px] w-[96px] -translate-x-1/2 rounded-full bg-[#111113]" />
        </div>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet={`/screens/${screen}-dark.jpg`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/screens/${screen}-light.jpg`}
            alt={ALT[screen]}
            width={390}
            height={783}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      </div>
    </div>
  )
}
