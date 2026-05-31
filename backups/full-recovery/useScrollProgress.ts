'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

/**
 * useScrollProgress
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a 0→1 value representing how far the user has scrolled through
 * a given element (or the entire page if no ref is provided).
 *
 * Performance: passive scroll listener, no layout thrashing.
 * Throttled with requestAnimationFrame to stay within 60fps budget.
 */
export function useScrollProgress(ref?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function update() {
      if (ref?.current) {
        const el   = ref.current
        const rect = el.getBoundingClientRect()
        const scrolled = -rect.top
        const total    = el.scrollHeight - window.innerHeight
        setProgress(Math.max(0, Math.min(1, scrolled / (total || 1))))
      } else {
        const scrolled = window.scrollY
        const total    = document.documentElement.scrollHeight - window.innerHeight
        setProgress(Math.max(0, Math.min(1, scrolled / (total || 1))))
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update() // initial call

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [ref])

  return progress
}

/**
 * useElementScrollProgress
 * ─────────────────────────────────────────────────────────────────────────────
 * More granular: tracks progress relative to element entering / leaving
 * the viewport. 0 = element just entered bottom of screen.
 *                1 = element's bottom is at top of screen.
 */
export function useElementScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function update() {
      if (!ref.current) return
      const rect   = ref.current.getBoundingClientRect()
      const wh     = window.innerHeight
      const start  = wh            // element enters from bottom
      const end    = -rect.height  // element fully scrolled past top

      const dist = rect.top - start
      const prog = dist / (end - start)
      setProgress(Math.max(0, Math.min(1, -prog)))
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [ref])

  return progress
}
