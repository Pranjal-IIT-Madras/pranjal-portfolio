'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils/cn'

interface SectionHeaderProps {
  /** e.g. "01" or "02" — monospace label above the title */
  index?: string
  /** Monospace category label e.g. "Journey" */
  label:  string
  /** Large display heading */
  title:  string
  /** Optional subtitle/description paragraph */
  description?: string
  /** Text alignment */
  align?: 'left' | 'center'
  className?: string
}

/**
 * SectionHeader
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared section title component used across all portfolio sections.
 * Animates in with a stagger when it enters the viewport.
 *
 * Visual structure:
 *   [01 — JOURNEY]        ← monospace label, cyan
 *   The Constellation     ← large Syne display heading
 *   description text...   ← optional body copy
 */
export default function SectionHeader({
  index,
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.3, once: true })

  const isCenter = align === 'center'

  return (
    <div
      ref={ref}
      className={cn(
        'relative',
        isCenter && 'text-center',
        className,
      )}
    >
      {/* Monospace label row */}
      <motion.div
        initial={{ opacity: 0, x: isCenter ? 0 : -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="flex items-center gap-3 mb-4"
        style={{ justifyContent: isCenter ? 'center' : 'flex-start' }}
      >
        {/* Decorative line */}
        <span
          className="flex-shrink-0 h-px w-8 bg-gradient-to-r from-[var(--cyan)] to-transparent"
          aria-hidden
        />

        <span className="section-label">
          {index && (
            <span className="text-white/30 mr-1.5">{index} —</span>
          )}
          {label}
        </span>
      </motion.div>

      {/* Display heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className={cn(
          'font-syne font-bold text-white leading-[1.05]',
          'text-gradient-cyan',
          'mb-4',
        )}
        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)' }}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.18 }}
          className="text-[var(--text-secondary)] font-manrope leading-relaxed max-w-2xl"
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
            marginInline: isCenter ? 'auto' : undefined,
          }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
