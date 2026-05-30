'use client'

import { useEffect, type ReactNode } from 'react'
import { registerGSAPPlugins } from '@/lib/animations/gsap-plugins'

interface GSAPProviderProps {
  children: ReactNode
}

/**
 * GSAPProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Registers all GSAP plugins the moment the app mounts on the client.
 * This must be a client component (plugins use browser APIs).
 * The guard in registerGSAPPlugins() prevents double-registration.
 */
export default function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    registerGSAPPlugins()
  }, [])

  return <>{children}</>
}
