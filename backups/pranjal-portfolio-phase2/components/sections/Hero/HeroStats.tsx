'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { QUICK_STATS } from '@/constants/personal'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'

/**
 * HeroStats
 * ─────────────────────────────────────────────────────────────────────────────
 * Four small stat chips displayed at the bottom of the hero section.
 * Numeric values animate up from 0 using GSAP.
 *
 * Data: pulled from PERSONAL.QUICK_STATS so it's easy to update.
 * Non-numeric values (like "∞") skip the counter animation.
 */
export default function HeroStats() {
  const valRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    QUICK_STATS.forEach((stat, i) => {
      const el = valRefs.current[i]
      if (!el) return

      const numericVal = parseInt(stat.value, 10)
      if (isNaN(numericVal)) return // skip "∞"

      gsap.fromTo(
        { n: 0 },
        { n: numericVal },
        {
          duration: 1.6,
          delay: 1.2 + i * 0.12,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round((this.targets()[0] as {n:number}).n).toString()
          },
        },
      )
    })
  }, [])

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3"
      role="list"
      aria-label="Quick statistics"
    >
      {QUICK_STATS.map((stat, i) => {
        const isNumeric = !isNaN(parseInt(stat.value, 10))
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            role="listitem"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/[0.08]"
            style={{ minWidth: '90px' }}
          >
            {/* Value */}
            <span
              className="font-syne font-bold text-[var(--cyan)]"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1 }}
              aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
            >
              <span
                ref={(el) => { valRefs.current[i] = el }}
              >
                {isNumeric ? '0' : stat.value}
              </span>
              {stat.suffix && (
                <span className="text-[var(--blue)]">{stat.suffix}</span>
              )}
            </span>

            {/* Label */}
            <span
              className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase leading-tight"
              aria-hidden
            >
              {stat.label}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
