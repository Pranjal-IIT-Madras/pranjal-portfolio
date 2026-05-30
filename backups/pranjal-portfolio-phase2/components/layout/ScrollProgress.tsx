'use client'

import { useEffect, useRef } from 'react'

/**
 * ScrollProgress
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a 2 px progress bar at the top of the viewport.
 * Uses scaleX transform (GPU-composited) — no layout thrashing.
 * Progress is driven by raw scroll, not Lenis (so it's always accurate).
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      if (!barRef.current) return
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ transformOrigin: 'left' }}
    />
  )
}
