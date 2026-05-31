'use client'

import { useRef, useCallback, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { cardReveal } from '@/lib/animations/framer-variants'
import { useCursor } from '@/components/cursor/CursorContext'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

export interface LeadershipItem {
  icon:        string
  title:       string
  body:        string
  color:       string
  metric?:     string
  metricLabel?: string
}

interface LeadershipCardProps {
  item:      LeadershipItem
  delay?:    number
  /** Float direction for the idle animation */
  floatDir?: 'up' | 'down'
}

/**
 * LeadershipCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Glassmorphic floating card for one leadership dimension.
 * The "floating" effect is a CSS animation (floatY keyframe) with
 * a random phase so cards don't all move in unison.
 *
 * Hover: GSAP tilt + glow intensify.
 */
export default function LeadershipCard({
  item,
  delay    = 0,
  floatDir = 'up',
}: LeadershipCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const hasFine    = useHasFinePointer()
  const { enterCard, leaveAll } = useCursor()

  const phase = useRef(Math.random() * 2)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!hasFine || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const dy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2

    gsap.to(cardRef.current, {
      rotationY:            dx * 7,
      rotationX:            -dy * 7,
      duration:             0.3,
      ease:                 'power2.out',
      transformPerspective: 900,
    })
  }, [hasFine])

  const handleMouseLeave = useCallback(() => {
    leaveAll()
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [leaveAll])

  const floatDuration = 5 + phase.current * 2
  const floatDelay    = -phase.current * floatDuration

  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={enterCard}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl overflow-hidden h-full"
        style={{
          background:     'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(18px)',
          border:         `1px solid ${item.color}18`,
          boxShadow:      `0 6px 28px rgba(0,0,0,0.35)`,
          animation:      `floatY ${floatDuration}s ${floatDelay}s ease-in-out infinite`,
          transition:     'border-color 0.3s, box-shadow 0.3s',
        }}
        onFocus={(e) => {
          ;(e.currentTarget).style.borderColor = `${item.color}40`
          ;(e.currentTarget).style.boxShadow   = `0 12px 40px rgba(0,0,0,0.45), 0 0 24px ${item.color}14`
        }}
        onBlur={(e) => {
          ;(e.currentTarget).style.borderColor = `${item.color}18`
          ;(e.currentTarget).style.boxShadow   = `0 6px 28px rgba(0,0,0,0.35)`
        }}
      >
        {/* Glow corner */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
          style={{
            background:  `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
            transform:   'translate(-30%, -30%)',
          }}
        />

        <div className="relative z-10 p-5 flex flex-col gap-3 h-full">

          {/* Icon + metric row */}
          <div className="flex items-start justify-between">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: `${item.color}14`,
                border:     `1px solid ${item.color}28`,
                boxShadow:  `0 0 14px ${item.color}18`,
              }}
              aria-hidden
            >
              {item.icon}
            </div>

            {item.metric && (
              <div className="text-right">
                <div
                  className="font-syne font-bold leading-none"
                  style={{ fontSize: '1.4rem', color: item.color }}
                >
                  {item.metric}
                </div>
                <div
                  className="font-mono text-[var(--text-muted)]"
                  style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}
                >
                  {item.metricLabel}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className="font-syne font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)' }}
          >
            {item.title}
          </h3>

          {/* Body */}
          <p
            className="font-manrope text-[var(--text-secondary)] leading-relaxed flex-1"
            style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.88rem)' }}
          >
            {item.body}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
