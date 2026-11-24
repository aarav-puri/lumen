'use client'

import { Toaster as Sonner } from 'sonner'

/** Toasts sit above the mobile tab bar and pick up the app's tokens. */
export default function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      offset={88}
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink shadow-pop ring-1 ring-line/70',
          title: 'font-medium',
          description: 'text-ink-2',
          actionButton:
            'ml-auto shrink-0 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent-ink',
          icon: 'shrink-0',
        },
      }}
    />
  )
}
