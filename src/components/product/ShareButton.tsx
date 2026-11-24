'use client'

import { useState } from 'react'
import { Share } from 'lucide-react'
import { toast } from 'sonner'
import type { Food } from '@/lib/food'
import { shareFood } from '@/lib/share-card'
import Button from '@/components/ui/Button'

/** Makes an image of the product's score and opens the share sheet. */
export default function ShareButton({ food }: { food: Food }) {
  const [busy, setBusy] = useState(false)
  return (
    <Button
      variant="secondary"
      size="sm"
      loading={busy}
      icon={<Share className="h-4 w-4" aria-hidden="true" />}
      onClick={async () => {
        setBusy(true)
        try {
          const r = await shareFood(food)
          if (r === 'downloaded') toast.success('Card saved', { description: 'Look for it in your downloads.' })
        } catch {
          toast.error('Could not make the card. Try again.')
        } finally {
          setBusy(false)
        }
      }}
    >
      Share
    </Button>
  )
}
