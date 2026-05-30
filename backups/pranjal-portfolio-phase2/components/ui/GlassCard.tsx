'use client'

import {
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { cn } from '@/lib/utils/cn'
import { useCursor } from '@/components/cursor/CursorContext'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { cardReveal } from '@/lib/animations/framer-variants'

interface GlassCardProps {
  children:     ReactNode
  className?:   string
  /** Enable 3D tilt on hover */
  tilt?:        boolean
  /** Max tilt degrees (default 8) */
  tiltStrength?: number
  /** Delay for stagger animation */
  revealDelay?: number
  /** If true, no inView reveal animation (always visible) */
  noReveal?:    boolean
  onClick?:     () => void
  as?:          'div' | 'article' | 'section' | 'li'
}

/**
 * GlassCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium frosted-glass card used across Education, Projects, Certifications
 * and Leadership sections.
 *
 * Features:
 *  - Glassmorphic background (backdrop-filter blur)
 *  - Glow border that brightens on hover
 *  - 3D tilt via GSAP (perspective: 1000px on wrapper)
 *  - Subtle vertical lift on hover
 *  - Reveal animation via Framer Motion (cardReveal variant)
 *  - CursorContext update on enter/leave
 *
 * Performance: tilt is pure CSS transform (no layout thrashing).
 * backdrop-filter is GPU-composited on modern browsers.
 */
export default function GlassCard({
  children,
  className,
  tilt          = true,
  tiltStrength  = 8,
  revealDelay   = 0,
  noReveal      = false,
  onClick,
  as: Tag       = 'div',
}: GlassCardProps) {
  const cardRef    = useRef<HTMLElement>(null)
  const { enterCard, leaveAll } = useCursor()
  const hasFine = useHasFinePointer()

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!tilt || !hasFine || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) / (rect.width  / 2)
    const dy   = (e.clientY - cy) / (rect.height / 2)

    gsap.to(cardRef.current, {
      rotationY: dx * tiltStrength,
      rotationX: -dy * tiltStrength,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    })
  }, [tilt, hasFine, tiltStrength])

  const handleMouseLeave = useCallback(() => {
    leaveAll()
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [leaveAll])

  return (
    <motion.div
      variants={noReveal ? undefined : cardReveal}
      initial={noReveal ? undefined : 'hidden'}
      whileInView={noReveal ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: revealDelay }}
      // Lift on hover via Framer (separate from GSAP tilt)
      whileHover={{ y: -5 }}
    >
      <Tag
        ref={cardRef as React.Ref<any>}
        className={cn(
          'glass glass-hover',
          'rounded-2xl p-6',
          'relative overflow-hidden',
          onClick && 'cursor-pointer',
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={enterCard}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        // Keyboard accessibility when onClick is provided
        {...(onClick ? { role: 'button', tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') onClick()
          }
        } : {})}
      >
        {/* Subtle inner glow top-left (cosmetic) */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
            transform:  'translate(-30%, -30%)',
          }}
        />

        {children}
      </Tag>
    </motion.div>
  )
}
