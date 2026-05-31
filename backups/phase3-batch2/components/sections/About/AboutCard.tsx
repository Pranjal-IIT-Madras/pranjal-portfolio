'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { cardReveal } from '@/lib/animations/framer-variants'

/**
 * AboutCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium glass card used for the three highlight panels in the About section:
 *  1. Dual Enrollment (VIT + IIT simultaneously)
 *  2. Head Boy / Leadership
 *  3. Technology Curiosity
 *
 * Each card has:
 *  - Colored accent line on left border
 *  - Icon or emoji in a glow circle
 *  - Bold heading
 *  - Body text
 *  - Optional stat or badge
 */

interface AboutCardProps {
  /** Icon element rendered in the glow circle */
  icon:        ReactNode
  heading:     string
  body:        string
  /** Accent color for the left border + icon glow */
  color:       string
  /** Optional bottom badge/tag text */
  badge?:      string
  className?:  string
  delay?:      number
}

export default function AboutCard({
  icon,
  heading,
  body,
  color,
  badge,
  className,
  delay = 0,
}: AboutCardProps) {
  return (
    <motion.article
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={cn('relative rounded-2xl overflow-hidden', className)}
      style={{
        background:  'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(16px)',
        border:      `1px solid rgba(255,255,255,0.07)`,
        transition:  'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${color}30`
        ;(e.currentTarget as HTMLElement).style.boxShadow  = `0 8px 40px rgba(0,0,0,0.4), 0 0 24px ${color}12`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLElement).style.boxShadow  = 'none'
      }}
    >
      {/* Colored accent — left edge */}
      <div
        aria-hidden
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${color}00, ${color}, ${color}00)` }}
      />

      {/* Card content */}
      <div className="px-6 py-5">
        {/* Icon circle */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
          style={{
            background: `${color}14`,
            border:     `1px solid ${color}30`,
            boxShadow:  `0 0 12px ${color}20`,
          }}
          aria-hidden
        >
          <span style={{ color, fontSize: '18px' }}>{icon}</span>
        </div>

        {/* Heading */}
        <h3
          className="font-syne font-bold text-white mb-2 leading-tight"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.1rem)' }}
        >
          {heading}
        </h3>

        {/* Body */}
        <p
          className="font-manrope leading-relaxed text-[var(--text-secondary)]"
          style={{ fontSize: 'clamp(0.82rem, 1.4vw, 0.9rem)' }}
        >
          {body}
        </p>

        {/* Optional badge */}
        {badge && (
          <span
            className="inline-block mt-3 font-mono text-[9px] tracking-[0.2em] uppercase rounded-full px-3 py-1"
            style={{
              color:      color,
              background: `${color}12`,
              border:     `1px solid ${color}25`,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </motion.article>
  )
}
