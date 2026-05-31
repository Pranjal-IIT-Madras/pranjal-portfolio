'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import type { LucideIcon } from 'lucide-react'
import { cardReveal } from '@/lib/animations/framer-variants'
import { useCursor } from '@/components/cursor/CursorContext'

interface StatCardProps {
  icon:        LucideIcon
  label:       string
  value:       number | string
  /** Whether to run a GSAP count-up animation (only for numbers) */
  countUp?:    boolean
  suffix?:     string
  color:       string
  delay?:      number
  /** Brief description shown below label */
  description?: string
}

/**
 * StatCard
 * ─────────────────────────────────────────────────────────────────────────────
 * A single GitHub statistic in a glassmorphic card.
 * Numeric values animate from 0 to their final value using GSAP when
 * the card enters the viewport (useInView + gsap.from).
 *
 * Visual:
 * ┌────────────────────────┐
 * │  [Icon]                │
 * │                        │
 * │  1,234  ←  count-up   │
 * │  LABEL                 │
 * │  description           │
 * └────────────────────────┘
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  countUp      = true,
  suffix       = '',
  color,
  delay        = 0,
  description,
}: StatCardProps) {
  const valueRef   = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)
  const { enterCard, leaveAll } = useCursor()

  const numericValue = typeof value === 'number' ? value : parseInt(String(value), 10)
  const isNumeric    = !isNaN(numericValue) && countUp

  // GSAP count-up on viewport entry
  useEffect(() => {
    if (!isNumeric || !valueRef.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true

        const obj = { n: 0 }
        gsap.to(obj, {
          n:        numericValue,
          duration: 1.6,
          delay:    delay,
          ease:     'power2.out',
          onUpdate() {
            if (valueRef.current) {
              valueRef.current.textContent = Math.round(obj.n).toLocaleString()
            }
          },
          onComplete() {
            if (valueRef.current) {
              valueRef.current.textContent = numericValue.toLocaleString()
            }
          },
        })
        observer.disconnect()
      },
      { threshold: 0.5 },
    )

    if (valueRef.current) observer.observe(valueRef.current)
    return () => observer.disconnect()
  }, [isNumeric, numericValue, delay])

  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <article
        className="relative rounded-2xl p-5 h-full flex flex-col gap-3"
        style={{
          background:     'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(18px)',
          border:         `1px solid ${color}18`,
          transition:     'border-color 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={() => {
          enterCard()
        }}
        onMouseLeave={leaveAll}
        aria-label={`${label}: ${value}${suffix}`}
      >
        {/* Top glow */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
        />

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}12`,
            border:     `1px solid ${color}22`,
            boxShadow:  `0 0 12px ${color}15`,
          }}
          aria-hidden
        >
          <Icon size={18} style={{ color }} />
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span
            ref={valueRef}
            className="font-syne font-bold"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              color,
              lineHeight: 1,
              textShadow: `0 0 20px ${color}40`,
            }}
            aria-hidden
          >
            {isNumeric ? '0' : String(value)}
          </span>
          {suffix && (
            <span className="font-syne font-bold" style={{ fontSize: '1.2rem', color, opacity: 0.7 }}>
              {suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <div>
          <p
            className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--text-muted)]"
          >
            {label}
          </p>
          {description && (
            <p
              className="font-manrope text-[var(--text-muted)] mt-0.5"
              style={{ fontSize: '0.75rem' }}
            >
              {description}
            </p>
          )}
        </div>
      </article>
    </motion.div>
  )
}
