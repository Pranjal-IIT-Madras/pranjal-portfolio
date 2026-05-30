'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCursor } from './CursorContext'
import { useHasFinePointer } from '@/hooks/useMediaQuery'

/**
 * CustomCursor
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders two elements: a sharp dot (follows mouse exactly) and
 * a larger ring that lags slightly behind using GSAP quickTo.
 *
 * GSAP quickTo is ~10× faster than gsap.to() for per-frame position
 * updates — it avoids creating/deleting tweens and has no overhead.
 *
 * CursorContext drives visual state: button hover = larger ring,
 * card hover = blue ring, constellation node = pulsing ring.
 *
 * On touch / coarse-pointer devices: renders nothing (CSS hides both elements).
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hasFine = useHasFinePointer()
  const { cursorType } = useCursor()

  // ── Apply ring class based on cursor type ────────────────────────────────
  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    ring.classList.remove('is-hovering-button', 'is-hovering-card', 'is-hovering-link')
    if (cursorType === 'button' || cursorType === 'node') ring.classList.add('is-hovering-button')
    if (cursorType === 'card')   ring.classList.add('is-hovering-card')
    if (cursorType === 'link')   ring.classList.add('is-hovering-link')
  }, [cursorType])

  // ── GSAP quickTo setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasFine || !dotRef.current || !ringRef.current) return

    const dot  = dotRef.current
    const ring = ringRef.current

    document.body.classList.add('has-custom-cursor')

    // quickTo returns a function that accepts the target value instantly
    const dotX  = gsap.quickTo(dot,  'x', { duration: 0.05, ease: 'none' })
    const dotY  = gsap.quickTo(dot,  'y', { duration: 0.05, ease: 'none' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.20, ease: 'power2.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.20, ease: 'power2.out' })

    // Initial opacity
    gsap.set([dot, ring], { opacity: 0 })

    let visible = false

    function onMove(e: MouseEvent) {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)

      if (!visible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.35 })
        visible = true
      }
    }

    function onLeave() {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      visible = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [hasFine])

  // Don't render on touch devices
  if (!hasFine) return null

  return (
    <>
      {/* Dot — snaps to mouse position */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
        style={{
          boxShadow: '0 0 8px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.4)',
        }}
      />

      {/* Ring — lags behind with easing */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
        style={{
          boxShadow: 'inset 0 0 6px rgba(6,182,212,0.2)',
        }}
      />
    </>
  )
}
