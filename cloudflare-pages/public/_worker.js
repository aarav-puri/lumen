// Hands every request to the Lumen Worker.
//
// Next.js marks prerendered pages `s-maxage=31536000`, which would let
// Cloudflare's cache in front of Pages keep an old page for a year after a
// deploy. Pages are therefore passed through uncached; hashed static files
// under /_next/static keep their long cache.
export default {
  async fetch(request, env) {
    const response = await env.LUMEN.fetch(request)
    const type = response.headers.get('content-type') || ''
    const path = new URL(request.url).pathname
    if (path.startsWith('/_next/static/') || !(type.includes('text/html') || type.includes('text/x-component'))) {
      return response
    }
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    headers.delete('CDN-Cache-Control')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
  },
}
