'use client'

import { Suspense } from 'react'
import AppShell from '@/components/app/AppShell'
import { CompareView } from '@/components/app/CompareView'

export default function ComparePage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <CompareView />
      </Suspense>
    </AppShell>
  )
}
