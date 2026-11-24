import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import Toaster from '@/components/ui/Toaster'
import ServiceWorker from '@/components/ServiceWorker'
import './globals.css'

/** Inter for reading, Manrope for headings. */
const sans = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const display = Manrope({ subsets: ['latin'], display: 'swap', weight: ['500', '600', '700', '800'], variable: '--font-display' })

export const metadata: Metadata = {
  title: {
    default: 'Lumen',
    template: '%s · Lumen',
  },
  description:
    'Scan any food barcode for a health score out of 100, how processed it is, and every additive and allergen explained, checked against your diet. Free, with no ads.',
  applicationName: 'Lumen',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-167.png', sizes: '167x167' },
      { url: '/icons/apple-touch-icon-152.png', sizes: '152x152' },
      { url: '/icons/apple-touch-icon-120.png', sizes: '120x120' },
    ],
  },
  appleWebApp: { capable: true, title: 'Lumen', statusBarStyle: 'black-translucent' },
  manifest: '/manifest.webmanifest',
  verification: {
    google: '9_JzOdfOk3oOJkfW-pZ7t_XjlRBABpYdauzpEX9h1i0',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#09090b' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
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
        <ServiceWorker />
      </body>
    </html>
  )
}
