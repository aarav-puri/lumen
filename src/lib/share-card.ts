'use client'

import { GRADE_INFO, type Food } from '@/lib/food'

// The score scale in the logo's spectrum. Matches --iris-score in globals.css.
const SCALE: [number, string][] = [[0, '#ffb38a'], [0.3, '#d59cff'], [0.55, '#8b7bff'], [0.78, '#82c4ff'], [1, '#5fe3d0']]

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Wraps `text` to at most `maxLines` lines that fit `width`, adding an ellipsis if cut. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (ctx.measureText(next).width <= width) {
      line = next
      continue
    }
    if (line) lines.push(line)
    line = w
    if (lines.length === maxLines) break
  }
  if (lines.length < maxLines && line) lines.push(line)
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    let last = lines[maxLines - 1]
    while (ctx.measureText(`${last}…`).width > width && last.length) last = last.slice(0, -1)
    lines[maxLines - 1] = `${last}…`
  }
  return lines
}

/** Draws a 1080 x 1350 card for a product's score and returns it as a PNG. */
export async function renderShareCard(food: Food): Promise<Blob> {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  await document.fonts.ready
  const display = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'sans-serif'
  const sans = getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim() || 'sans-serif'

  // Background: near-black with a violet and peach glow.
  ctx.fillStyle = '#09090b'
  ctx.fillRect(0, 0, W, H)
  const g1 = ctx.createRadialGradient(W * 0.2, H * 0.15, 0, W * 0.2, H * 0.15, W * 0.8)
  g1.addColorStop(0, 'rgba(139,123,255,0.35)')
  g1.addColorStop(1, 'rgba(139,123,255,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, W, H)
  const g2 = ctx.createRadialGradient(W * 0.9, H * 0.95, 0, W * 0.9, H * 0.95, W * 0.7)
  g2.addColorStop(0, 'rgba(255,179,138,0.22)')
  g2.addColorStop(1, 'rgba(255,179,138,0)')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, W, H)

  const pad = 96

  // Brand
  try {
    const mark = await loadImage('/brand/lumen-mark.png')
    ctx.drawImage(mark, pad, pad, 72, 72)
  } catch {}
  ctx.fillStyle = '#e8e8ee'
  ctx.font = `700 52px ${display}`
  ctx.textBaseline = 'middle'
  ctx.fillText('lumen', pad + 88, pad + 38)

  // Product
  ctx.textBaseline = 'alphabetic'
  let y = 360
  if (food.brand) {
    ctx.fillStyle = '#9a9aa8'
    ctx.font = `500 40px ${sans}`
    ctx.fillText(food.brand, pad, y)
    y += 24
  }
  ctx.fillStyle = '#f2f2f6'
  ctx.font = `700 92px ${display}`
  for (const line of wrap(ctx, food.name, W - pad * 2, 2)) {
    y += 100
    ctx.fillText(line, pad, y)
  }

  // Score
  y = Math.max(y + 170, 820)
  if (food.grade && food.score !== null) {
    ctx.fillStyle = '#f2f2f6'
    ctx.font = `800 260px ${display}`
    ctx.fillText(String(food.score), pad - 8, y)
    const scoreW = ctx.measureText(String(food.score)).width
    ctx.fillStyle = '#9a9aa8'
    ctx.font = `500 52px ${sans}`
    ctx.fillText('/100', pad + scoreW + 8, y)
    ctx.fillStyle = '#f2f2f6'
    ctx.font = `700 64px ${display}`
    const label = GRADE_INFO[food.grade].label
    ctx.fillText(label, W - pad - ctx.measureText(label).width, y)

    // Meter: one iridescent bar, dimmed past the score, with a glass marker.
    const my = y + 70
    const mw = W - pad * 2
    const grad = ctx.createLinearGradient(pad, 0, pad + mw, 0)
    for (const [at, c] of SCALE) grad.addColorStop(at, c)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(pad, my, mw, 26, 13)
    ctx.fill()
    const dot = pad + (food.score / 100) * mw
    ctx.fillStyle = 'rgba(9,9,11,0.7)'
    ctx.beginPath()
    ctx.roundRect(dot, my, pad + mw - dot, 26, [0, 13, 13, 0])
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.beginPath()
    ctx.arc(dot, my + 13, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f6f4ff'
    ctx.beginPath()
    ctx.arc(dot, my + 13, 20, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = '#f2f2f6'
    ctx.font = `700 96px ${display}`
    ctx.fillText('Not scored', pad, y)
  }

  // Footer
  ctx.fillStyle = '#9a9aa8'
  ctx.font = `500 34px ${sans}`
  ctx.fillText('Scanned with Lumen', pad, H - pad)

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not draw the card'))), 'image/png'))
}

/** Opens the system share sheet with the card, or downloads it where sharing files is not supported. */
export async function shareFood(food: Food): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const blob = await renderShareCard(food)
  const slug = food.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'product'
  const file = new File([blob], `lumen-${slug}.png`, { type: 'image/png' })
  const text = food.score !== null ? `${food.name}: ${food.score}/100 on Lumen.` : `${food.name} on Lumen.`
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: food.name, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return 'downloaded'
}
