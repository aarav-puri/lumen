/**
 * An iPhone 16 Pro around a real screenshot of Lumen. Geometry follows the
 * 21st.dev "iPhone 16 Pro" mockup (designali-in), drawn up in Black Titanium
 * with side buttons, antenna bands, a Dynamic Island and a glass reflection.
 * Screens live in public/screens as `<name>.jpg`, captured at 393 x 852 (2x).
 */
import { useId } from 'react'

export type Screen = 'scan' | 'report' | 'profile' | 'chat'

const ALT: Record<Screen, string> = {
  scan: 'The Lumen scanner, with a large Scan with camera button',
  report: 'A Lumen report for Nutella: health score 8 out of 100, and a banner saying it does not fit your profile',
  profile: 'The food profile, with the diets you follow and the allergens you avoid',
  chat: 'Lumen AI, offering questions to ask about your scans',
}

// Screen rectangle inside the 200 x 400 artboard.
const S = { x: 14.1, y: 12.8, w: 171.9, h: 374.4, r: 25.4 }

export function Phone({ screen, className = '', priority = false }: { screen: Screen; className?: string; priority?: boolean }) {
  const id = useId().replace(/:/g, '')
  const src = `/screens/${screen}.jpg`
  return (
    <div className={`relative w-[300px] shrink-0 ${className}`}>
      {/* The real image, for screen readers and loading priority; the SVG draws it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={ALT[screen]} loading={priority ? 'eager' : 'lazy'} className="sr-only" />
      <svg viewBox="-6 -2 212 404" className="block h-auto w-full drop-shadow-[0_40px_60px_rgb(0_0_0/0.75)]" aria-hidden="true">
        <defs>
          {/* Black Titanium: a lit left edge, a dark brushed face, a softer right edge. */}
          <linearGradient id={`ti-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#77777b" />
            <stop offset="0.035" stopColor="#2c2c2f" />
            <stop offset="0.5" stopColor="#1b1b1d" />
            <stop offset="0.965" stopColor="#262629" />
            <stop offset="1" stopColor="#5d5d61" />
          </linearGradient>
          <linearGradient id={`tiV-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.1" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.9" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={`btn-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#151517" />
            <stop offset="0.5" stopColor="#4b4b4f" />
            <stop offset="1" stopColor="#151517" />
          </linearGradient>
          <linearGradient id={`glare-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="0.38" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="0.39" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`lens-${id}`} cx="0.35" cy="0.35" r="0.65">
            <stop offset="0" stopColor="#3b4a8f" />
            <stop offset="0.5" stopColor="#141a3a" />
            <stop offset="1" stopColor="#05060c" />
          </radialGradient>
          {/* Inner shadow where the glass meets the bezel. */}
          <radialGradient id={`edge-${id}`} cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.82" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
          <clipPath id={`screen-${id}`}>
            <rect x={S.x} y={S.y} width={S.w} height={S.h} rx={S.r} />
          </clipPath>
        </defs>

        {/* Side buttons: Action and volume on the left, power and Camera Control on the right. */}
        <rect x="-1.6" y="66" width="3.4" height="18" rx="1.5" fill={`url(#btn-${id})`} />
        <rect x="-1.6" y="98" width="3.4" height="30" rx="1.5" fill={`url(#btn-${id})`} />
        <rect x="-1.6" y="136" width="3.4" height="30" rx="1.5" fill={`url(#btn-${id})`} />
        <rect x="198.2" y="110" width="3.4" height="46" rx="1.5" fill={`url(#btn-${id})`} />
        <rect x="198.6" y="230" width="2.6" height="32" rx="1.2" fill={`url(#btn-${id})`} />

        {/* Frame, then its bevel light, then the black bezel. */}
        <rect x="0.5" y="0.5" width="199" height="399" rx="36" fill={`url(#ti-${id})`} />
        <rect x="0.5" y="0.5" width="199" height="399" rx="36" fill={`url(#tiV-${id})`} />
        <rect x="0.5" y="0.5" width="199" height="399" rx="36" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="0.5" />
        <rect x="2.3" y="2.3" width="195.4" height="395.4" rx="34.4" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.5" />
        {/* Antenna bands cut into the frame. */}
        <g fill="#0a0a0b">
          <rect x="0.4" y="44" width="2.2" height="1.6" />
          <rect x="197.4" y="44" width="2.2" height="1.6" />
          <rect x="0.4" y="354" width="2.2" height="1.6" />
          <rect x="197.4" y="354" width="2.2" height="1.6" />
          <rect x="44" y="0.4" width="1.6" height="2.2" />
          <rect x="154.4" y="397.4" width="1.6" height="2.2" />
        </g>
        <rect x="3.4" y="3.4" width="193.2" height="393.2" rx="33.4" fill="#020203" />

        {/* Screen */}
        <rect x={S.x} y={S.y} width={S.w} height={S.h} rx={S.r} fill="#09090b" />
        <image
          href={src}
          x={S.x}
          y={S.y}
          width={S.w}
          height={S.h}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#screen-${id})`}
        />
        <rect x={S.x} y={S.y} width={S.w} height={S.h} rx={S.r} fill={`url(#edge-${id})`} />
        <rect x={S.x} y={S.y} width={S.w} height={S.h} rx={S.r} fill={`url(#glare-${id})`} />

        {/* Dynamic Island with its front camera. */}
        <rect x="76.5" y="20.2" width="47" height="13.6" rx="6.8" fill="#000" />
        <circle cx="117" cy="27" r="3.3" fill={`url(#lens-${id})`} />
        <circle cx="116" cy="26" r="0.9" fill="#8fa6ff" fillOpacity="0.55" />
      </svg>
    </div>
  )
}
