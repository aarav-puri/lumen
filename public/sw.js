/* Lumen service worker. Makes the app installable and usable offline.
   - Build assets (/_next/static) never change, so they are cached first.
   - Pages and images try the network, then fall back to the last copy.
   - API routes and anything cross-origin (Supabase, Google) are never cached,
     so personal data always comes from the network or the app's own storage. */
const VERSION = 'lumen-v1'
const SHELL = ['/', '/app', '/history', '/compare', '/manifest.webmanifest', '/brand/lumen-mark.webp', '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()))
            return res
          })
      )
    )
    return
  }

  // Pages, images and everything else: network first, cache as a fallback.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (req.mode === 'navigate' || /\.(png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname))) {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(async () => {
        const hit = await caches.match(req, { ignoreSearch: req.mode === 'navigate' })
        if (hit) return hit
        if (req.mode === 'navigate') return (await caches.match('/app')) || Response.error()
        return Response.error()
      })
  )
})
