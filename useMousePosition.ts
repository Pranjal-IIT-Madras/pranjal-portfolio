'use client'

import { useEffect, useRef } from 'react'

export interface MousePosition {
  x: number
  y: number
  /** Normalized -1 to 1 */
  nx: number
  /** Normalized -1 to 1 */
  ny: number
}

/**
 * useMousePosition
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a stable ref containing the current mouse position.
 * Ref (not state) = zero re-renders. Consumers read from the ref in useFrame
 * or RAF loops, not during render.
 *
 * Performance: single global mousemove listener, passive, no reconciliation.
 */
export function useMousePosition(): React.RefObject<MousePosition> {
  const ref = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const x = e.clientX
      const y = e.clientY
      ref.current = {
        x,
        y,
        nx: (x / window.innerWidth)  * 2 - 1,
        ny: -(y / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return ref
}
