/* eslint-disable @next/next/no-img-element */
/**
 * The Lumen mark: an iridescent liquid-glass "L", rendered as a transparent
 * image (public/brand/lumen-mark.webp). `tile` is accepted for older call
 * sites and has no effect.
 */
export default function BrandMark({ className = '', size = 64 }: { className?: string; tile?: boolean; size?: number }) {
  return <img src="/brand/lumen-mark.webp" alt="" aria-hidden="true" width={size} height={size} className={`object-contain ${className}`} />
}
