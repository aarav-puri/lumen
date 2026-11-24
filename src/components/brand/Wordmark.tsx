import BrandMark from './BrandMark'

export default function Wordmark({ className = '' }: { byline?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.5rem] font-bold tracking-[-0.045em] text-ink">lumen<span className="iris-text">.</span></span>
      </span>
    </span>
  )
}
