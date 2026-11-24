/**
 * Barcode reading for the camera and for photos.
 *
 * The browser's own BarcodeDetector is used wherever it exists (Chrome on
 * Android, most Chromium desktops): it is fast and reads damaged codes well.
 * Everywhere else, notably Safari and iPhone, the same API comes from
 * `barcode-detector`, which runs ZXing in WebAssembly. Its .wasm file is
 * served from /wasm, so scanning never depends on a third-party CDN.
 */

const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf']

/** GTIN check digit (EAN-8, UPC-A, EAN-13, GTIN-14). Codes of other lengths pass. */
export function isValidGtin(code: string) {
  if (!/^\d+$/.test(code)) return false
  if (![8, 12, 13, 14].includes(code.length)) return code.length >= 6
  const digits = code.split('').map(Number)
  const check = digits.pop()!
  const sum = digits
    .reverse()
    .reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === check
}

/** Keeps the digits only: some readers include spaces or a symbology prefix. */
export function normalizeCode(raw: string) {
  return raw.replace(/\D/g, '')
}

export type Detector = { detect: (src: ImageBitmapSource) => Promise<{ rawValue: string }[]> }

async function nativeDetector(): Promise<Detector | null> {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) return null
  try {
    const BD = (window as any).BarcodeDetector
    const supported: string[] = await BD.getSupportedFormats()
    const formats = FORMATS.filter((f) => supported.includes(f))
    if (!formats.includes('ean_13')) return null
    return new BD({ formats }) as Detector
  } catch {
    return null
  }
}

async function zxingDetector(): Promise<Detector> {
  const { BarcodeDetector, prepareZXingModule, ZXING_WASM_VERSION } = await import('barcode-detector/ponyfill')
  // Load the reader now, so a broken download fails here, not on the first frame.
  await prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) =>
        path.endsWith('.wasm') ? `/wasm/${path.replace('.wasm', `-${ZXING_WASM_VERSION}.wasm`)}` : prefix + path,
    },
    fireImmediately: true,
  })
  return new BarcodeDetector({ formats: FORMATS as any }) as unknown as Detector
}

let detectorPromise: Promise<{ detector: Detector; native: boolean }> | null = null

/** The best reader this browser has, loaded once. */
export function getDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const native = await nativeDetector()
      if (native) return { detector: native, native: true }
      return { detector: await zxingDetector(), native: false }
    })()
    detectorPromise.catch(() => (detectorPromise = null))
  }
  return detectorPromise
}

/** Reads the first valid barcode in a photo, or null. */
export async function decodeImage(file: Blob): Promise<string | null> {
  const { detector } = await getDetector()
  const bitmap = await createImageBitmap(file)
  try {
    const results = await detector.detect(bitmap)
    return results.map((r) => normalizeCode(r.rawValue)).find(isValidGtin) ?? null
  } finally {
    bitmap.close?.()
  }
}
