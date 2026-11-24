'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { Camera, ChevronRight, ImageUp, Leaf, Search, Keyboard } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { decodeImage, isValidGtin } from '@/lib/barcode'
import { isProfileEmpty } from '@/lib/profile'
import CameraScanner from '@/components/app/CameraScanner'
import PageHeader from '@/components/app/PageHeader'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function ScannerHome({ onOpen }: { onOpen: (code: string) => void }) {
  const router = useRouter()
  const { profile, user } = useAuth()
  const [method, setMethod] = useState<'upload' | 'manual'>('upload')
  const [camera, setCamera] = useState(false)
  const [number, setNumber] = useState('')
  const [reading, setReading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const numberRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()
  // Deep link from the command palette: /app?camera=1 opens the camera.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('camera') === '1') setCamera(true)
  }, [])

  // Set after mount so the server and the browser render the same first frame.
  const [greeting, setGreeting] = useState('Hello')
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 5 ? 'Hello' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening')
  }, [])
  // The tab panels differ in height; measure the open one so the card eases between them.
  const panelsRef = useRef<HTMLDivElement>(null)
  const [panelsHeight, setPanelsHeight] = useState<number>()

  useEffect(() => {
    const el = panelsRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setPanelsHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const readPhoto = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('That is not an image. Use a photo of the barcode.')
        return
      }
      setMethod('upload')
      setReading(true)
      try {
        const code = await decodeImage(file)
        if (code) onOpen(code)
        else
          toast.error('No barcode found in that photo', {
            description: 'Get closer, keep it flat and in focus, or type the number.',
          })
      } catch {
        toast.error('Could not read that image.')
      } finally {
        setReading(false)
      }
    },
    [onOpen]
  )

  // Paste a screenshot or photo anywhere on the page.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.items ?? [])
        .find((i) => i.type.startsWith('image/'))
        ?.getAsFile()
      if (file) {
        e.preventDefault()
        readPhoto(file)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [readPhoto])

  const submitNumber = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = number.replace(/\D/g, '')
    if (!clean) {
      numberRef.current?.focus()
      return
    }
    if ([8, 12, 13].includes(clean.length) && !isValidGtin(clean)) {
      toast('That check digit looks off', { description: 'Looking it up anyway. Double-check the last digit if nothing comes back.' })
    }
    onOpen(clean)
  }

  return (
    <div
      onDragOver={(e) => {
        if (Array.from(e.dataTransfer.types).includes('Files')) {
          e.preventDefault()
          setDragging(true)
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'))
        if (file) readPhoto(file)
      }}
      className="relative"
    >
      <div className="mx-auto max-w-2xl">
      <PageHeader
        id="scan-h"
        title={user?.user_metadata?.display_name ? `${greeting}, ${user.user_metadata.display_name}.` : `${greeting}.`}
        subtitle="What are you checking today? Scan the barcode, use a photo, or type the number."
      />
      <section aria-labelledby="scan-h" className="scanner-workspace">
        {/* The live camera is the main way in; the tabs below are the fallbacks. */}
        <button type="button" onClick={() => setCamera(true)} className="scan-camera-button group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/glass/barcode.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-3 w-40 -translate-x-1/2 drop-shadow-[0_20px_40px_rgb(139_123_255/0.45)] transition-transform duration-500 group-hover:scale-105 sm:top-2 sm:w-48"
          />
          <span className="flex items-center gap-2">
            <Camera className="h-5 w-5" aria-hidden="true" />
            Scan with camera
          </span>
        </button>
        <div role="tablist" aria-label="Other ways to scan" className="scan-switch">
          {([{id:'upload',label:'Upload photo',icon:ImageUp},{id:'manual',label:'Enter manually',icon:Keyboard}] as const).map((item,index,items) => (
            <button key={item.id} id={`tab-${item.id}`} role="tab" type="button" aria-selected={method === item.id} aria-controls={`panel-${item.id}`} tabIndex={method === item.id ? 0 : -1}
              onClick={() => setMethod(item.id)}
              onKeyDown={(e) => {
                const n = items.length
                const target = e.key === 'ArrowRight' ? (index + 1) % n : e.key === 'ArrowLeft' ? (index + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
                if (target < 0) return
                e.preventDefault(); setMethod(items[target].id)
                document.getElementById(`tab-${items[target].id}`)?.focus()
              }}>
              {method === item.id && (
                <motion.span layoutId="scan-tab" aria-hidden="true" className="scan-switch-pill" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }} />
              )}
              <item.icon className="relative h-4 w-4" aria-hidden="true" /><span className="relative">{item.label}</span>
            </button>
          ))}
        </div>
        <motion.div animate={{ height: panelsHeight ?? 'auto' }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 36 }} className="overflow-hidden">
          <div ref={panelsRef}>
          <div id="panel-upload" role="tabpanel" aria-labelledby="tab-upload" hidden={method !== 'upload'} tabIndex={0} className="scan-panel">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={reading} className={`scan-upload ${dragging ? 'is-dragging' : ''}`}>
              {reading ? <Spinner className="h-7 w-7" /> : <ImageUp className="h-7 w-7 text-ink-2" aria-hidden="true" strokeWidth={1.6} />}
              <span className="font-medium">{reading ? 'Reading barcode…' : dragging ? 'Drop your photo here' : 'Choose a barcode photo'}</span>
              <span className="text-sm text-ink-3">Or drag and drop, or paste an image</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-label="Barcode photo" onChange={(e) => { const f=e.target.files?.[0]; e.target.value=''; if(f) readPhoto(f) }} />
            <p role="status" className="sr-only">{reading ? 'Reading barcode from your photo' : ''}</p>
          </div>
          <div id="panel-manual" role="tabpanel" aria-labelledby="tab-manual" hidden={method !== 'manual'} tabIndex={0} className="scan-panel">
                        <form onSubmit={submitNumber} className="text-left" role="search" aria-label="Look up a barcode number">
              <label htmlFor="barcode-number" className="mb-2 block text-sm font-medium">Barcode number</label>
              <input ref={numberRef} id="barcode-number" inputMode="numeric" autoComplete="off" enterKeyHint="search" placeholder="e.g. 3017620422003" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d\s]/g, ''))} className="field h-14 tnum text-lg tracking-[0.04em]" />
              <Button type="submit" className="mt-5 h-12 w-full" disabled={!number.trim()}><Search className="h-4 w-4" aria-hidden="true" />Look up product</Button>
            </form>
          </div>
          </div>
        </motion.div>
      </section>
          {isProfileEmpty(profile) && (
            <button
              type="button"
              onClick={() => router.push('/settings#profile')}
              className="tile mt-3 flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink"><Leaf className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Set up your food profile</span>
                <span className="block text-sm text-ink-3">Diets and allergens, checked on every scan</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-ink-3" aria-hidden="true" />
            </button>
          )}
      </div>

      {camera && (
        <CameraScanner
          onDetected={(c) => {
            navigator.vibrate?.(15)
            setCamera(false)
            onOpen(c)
          }}
          onClose={() => setCamera(false)}
          onTypeInstead={() => {
            setCamera(false)
            setMethod('manual')
            requestAnimationFrame(() => numberRef.current?.focus())
          }}
        />
      )}
    </div>
  )
}

