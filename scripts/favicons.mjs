// Render the round favicons from the header logo (public/brand/lumen-mark.png).
// Run from the repo root: node scripts/favicons.mjs
// The glass L sits on the site's near-black background inside a circle, with a
// faint lavender glow behind it and a hairline edge so it reads on light tabs.
import sharp from 'sharp'

const MARK = 'public/brand/lumen-mark.png'
const S = 512

const badge = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#8b7bff" stop-opacity="0.28" />
      <stop offset="1" stop-color="#8b7bff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="254" fill="#09090b" />
  <circle cx="256" cy="256" r="254" fill="url(#glow)" />
  <circle cx="256" cy="256" r="251" fill="none" stroke="#ffffff" stroke-opacity="0.14" stroke-width="5" />
</svg>`)

const markSize = Math.round(S * 0.66)
const mark = await sharp(MARK).resize(markSize, markSize).png().toBuffer()
const master = await sharp(badge)
  .composite([{ input: mark, left: Math.round((S - markSize) / 2), top: Math.round((S - markSize) / 2) }])
  .png()
  .toBuffer()

for (const [size, out] of [
  [32, 'public/icons/favicon-32.png'],
  [64, 'public/icons/favicon-64.png'],
  [192, 'public/icons/icon-192.png'],
]) {
  await sharp(master).resize(size, size, { kernel: 'lanczos3' }).png().toFile(out)
  console.log(out)
}
