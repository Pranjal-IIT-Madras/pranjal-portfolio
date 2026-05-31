'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { gsap } from '@/lib/animations/gsap-plugins'

/**
 * SmoothScrollProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates a Lenis instance and drives it from GSAP's ticker.
 * This is the canonical pattern for GSAP + Lenis coexistence:
 *   - GSAP ticker calls lenis.raf() every frame
 *   - ScrollTrigger gets accurate scroll position from Lenis
 *   - lagSmoothing(0) prevents GSAP from over-compensating dropped frames
 *
 * Performance: single RAF loop shared between GSAP and Lenis.
 *
 * Access the Lenis instance via useLenis() for programmatic scrolling.
 * E.g.: const lenis = useLenis(); lenis?.scrollTo('#section')
 */

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:           1.3,
      easing:             (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation:        'vertical',
      gestureOrientation: 'vertical',
      smoothWheel:        true,
      wheelMultiplier:    1,
      touchMultiplier:    2,
      infinite:           false,
    })

    lenisRef.current = lenis

    // Hook into GSAP ticker so both share the same RAF loop
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(() => {})
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
