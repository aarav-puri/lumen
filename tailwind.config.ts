import type { Config } from 'tailwindcss'

/**
 * Nourish design tokens. A soft grey canvas, white cards, one deep green
 * accent (from the 21st.dev SeaGreen Minimal theme), and the food grade ramp.
 * Every colour is an RGB triple in globals.css so dark mode is one swap.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        surface: { DEFAULT: token('surface'), 2: token('surface-2'), 3: token('surface-3') },
        ink: { DEFAULT: token('ink'), 2: token('ink-2'), 3: token('ink-3') },
        line: { DEFAULT: token('line'), strong: token('line-strong') },
        accent: { DEFAULT: token('accent'), ink: token('accent-ink'), soft: token('accent-soft') },
        'on-ink': token('on-ink'),
        'on-accent': token('on-accent'),
        grade: {
          a: token('grade-a'),
          b: token('grade-b'),
          c: token('grade-c'),
          d: token('grade-d'),
          e: token('grade-e'),
        },
        level: {
          low: token('level-low'),
          moderate: token('level-moderate'),
          high: token('level-high'),
        },
      },
      // Inter for text, Satoshi for headings. `mono` is an alias of the sans so
      // no screen can fall back to a monospace face; numbers use tabular figures.
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      // Calm, single-layer elevation. The old neumorphic names are kept as
      // aliases so every existing surface picks up the new look.
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / 0.04)',
        lift: '0 1px 2px rgb(var(--shadow) / 0.04), 0 12px 32px -16px rgb(var(--shadow) / 0.18)',
        pop: '0 2px 6px rgb(var(--shadow) / 0.06), 0 24px 56px -20px rgb(var(--shadow) / 0.28)',
        neu: '0 2px 6px rgb(var(--shadow) / 0.06), 0 24px 56px -20px rgb(var(--shadow) / 0.28)',
        'neu-hover': '0 1px 2px rgb(var(--shadow) / 0.04), 0 12px 32px -16px rgb(var(--shadow) / 0.18)',
        'neu-sm': '0 1px 2px rgb(var(--shadow) / 0.05)',
        'neu-inset': 'none',
        'neu-inset-deep': 'none',
        'neu-inset-sm': 'none',
        'neu-press-color': 'none',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        sweep: {
          '0%, 100%': { transform: 'translateY(-46%)' },
          '50%': { transform: 'translateY(46%)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out both',
        rise: 'rise 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        sweep: 'sweep 2.4s ease-in-out infinite',
        spin: 'spin 700ms linear infinite',
        'accordion-down': 'accordion-down 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        'accordion-up': 'accordion-up 200ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
export default config
