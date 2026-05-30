'use client'

import { useMemo, useEffect, useRef } from 'react'

interface Particle {
  id:       number
  x:        number  // % across container
  y:        number  // % down container
  size:     number  // px diameter
  opacity:  number
  duration: number  // animation duration in seconds
  delay:    number  // animation delay in seconds
  color:    string
  driftX:   number  // horizontal drift range in px
}

const COLORS = [
  'rgba(6,  182, 212, 0.7)',  // cyan
  'rgba(59, 130, 246, 0.6)',  // blue
  'rgba(6,  182, 212, 0.4)',  // cyan dim
  'rgba(59, 130, 246, 0.3)',  // blue dim
  'rgba(139, 92, 246, 0.3)',  // purple dim
  'rgba(255, 255, 255, 0.5)', // white
]

/**
 * HeroParticles
 * ─────────────────────────────────────────────────────────────────────────────
 * 90 floating particles rendered as CSS-animated divs — no WebGL.
 * This keeps the hero WebGL budget zero (galaxy background is already running).
 *
 * Mouse reaction: the entire particle field subtly shifts using a CSS
 * custom property updated on mousemove. Each particle's position is offset
 * by its depth (size) — deeper (smaller) particles move less.
 */
export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id:       i,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      size:     Math.random() * 4 + 1.5,
      opacity:  Math.random() * 0.6 + 0.2,
      duration: Math.random() * 10 + 8,
      delay:    Math.random() * -15,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      driftX:   (Math.random() - 0.5) * 60,
    }))
  }, [])

  // Mouse parallax via CSS transform on the container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetX = nx * 12
      targetY = ny * 8
    }

    function animate() {
      currentX += (targetX - currentX) * 0.04
      currentY += (targetY - currentY) * 0.04
      if (container) {
        container.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         '-20px',
        overflow:      'hidden',
        pointerEvents: 'none',
        willChange:    'transform',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position:        'absolute',
            left:            `${p.x}%`,
            top:             `${p.y}%`,
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            borderRadius:    '50%',
            background:      p.color,
            opacity:         p.opacity,
            filter:          `blur(${p.size > 3 ? 1 : 0}px)`,
            boxShadow:       p.size > 3 ? `0 0 ${p.size * 3}px ${p.color}` : 'none',
            animation:       `floatY ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange:      'transform',
          }}
        />
      ))}
    </div>
  )
}
