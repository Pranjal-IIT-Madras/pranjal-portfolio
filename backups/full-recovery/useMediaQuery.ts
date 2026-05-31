'use client'

import { useState, useEffect } from 'react'

/**
 * useMediaQuery
 * ─────────────────────────────────────────────────────────────────────────────
 * SSR-safe media query hook. Returns false during SSR (hydration safe).
 * Updates reactively when viewport changes.
 *
 * Usage:
 *   const isDesktop  = useMediaQuery('(min-width: 1024px)')
 *   const isMobile   = useMediaQuery('(max-width: 768px)')
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// ── Convenience exports ───────────────────────────────────────────────────────
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)')
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useHasFinePointer() {
  return useMediaQuery('(pointer: fine)')
}
