'use client'

import { useState, useEffect, RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number | number[]
  rootMargin?: string
  /** If true, observer disconnects after first intersection (fire-once) */
  once?: boolean
  /** Root element for intersection; null = viewport */
  root?: Element | null
}

/**
 * useInView
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps IntersectionObserver with a clean React interface.
 * Default behaviour: fires once when element enters the viewport.
 * Set once=false for persistent in/out tracking (e.g. sticky nav changes).
 */
export function useInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = {},
): boolean {
  const {
    threshold  = 0.15,
    rootMargin = '0px',
    once       = true,
    root       = null,
  } = options

  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin, root },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, root, once])

  return inView
}
