import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { AuthProvider } from '@/lib/auth-context'
import Toaster from '@/components/ui/Toaster'
import './globals.css'

/** Inter for reading, Satoshi (Fontshare, self-hosted) for headings. */
const sans = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const display = localFont({ src: './fonts/Satoshi-Variable.woff2', weight: '300 900', display: 'swap', variable: '--font-display' })

export const metadata: Metadata = {
  title: {
    default: 'Nourish | The fine print, made clear',
    template: '%s · Nourish',
  },
  description:
    'Scan any food barcode to see its health score out of 100, how processed it is, and every additive and allergen clearly explained, checked against your diet. Free, with no ads.',
  applicationName: 'Nourish',
  icons: {
    icon: [
      { url: '/brand/mark.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-167.png', sizes: '167x167' },
      { url: '/icons/apple-touch-icon-152.png', sizes: '152x152' },
      { url: '/icons/apple-touch-icon-120.png', sizes: '120x120' },
    ],
  },
  appleWebApp: { title: 'Nourish', statusBarStyle: 'default' },
  verification: {
    google: '9_JzOdfOk3oOJkfW-pZ7t_XjlRBABpYdauzpEX9h1i0',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfbf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0d' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
