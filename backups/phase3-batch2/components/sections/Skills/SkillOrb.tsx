'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Skill } from '@/constants/skills'
import { useCursor } from '@/components/cursor/CursorContext'

interface SkillOrbProps {
  skill:      Skill
  color:      string
  /** Stagger delay in seconds */
  delay?:     number
  /** Compact size for dense grids */
  compact?:   boolean
}

/**
 * SkillOrb
 * ─────────────────────────────────────────────────────────────────────────────
 * SVG circular progress ring.
 *
 * Geometry (standard size):
 *   viewBox: 0 0 120 120
 *   center:  cx=60, cy=60
 *   radius:  r=46
 *   stroke:  8px
 *   circumference: 2π × 46 ≈ 289.0
 *
 * Animation: stroke-dashoffset animates from circumference (empty)
 * to circumference × (1 - level/100) (filled to level%) when the
 * component enters the viewport. Uses Framer Motion's useInView.
 *
 * Hover: glow intensifies, scale 1 → 1.06, description appears.
 *
 * Performance: pure SVG, no canvas, minimal reflow.
 */

const R             = 46
const CIRCUMFERENCE = 2 * Math.PI * R   // 289.03
const CX            = 60
const CY            = 60

export default function SkillOrb({
  skill,
  color,
  delay    = 0,
  compact  = false,
}: SkillOrbProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const { enterCard, leaveAll } = useCursor()

  const size       = compact ? 96  : 120
  const fontSize   = compact ? 16  : 20
  const labelSize  = compact ? 9   : 10

  const targetOffset = CIRCUMFERENCE * (1 - skill.level / 100)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      onMouseEnter={enterCard}
      onMouseLeave={leaveAll}
      className="group flex flex-col items-center gap-2 cursor-default"
      role="img"
      aria-label={`${skill.name}: ${skill.level}% proficiency${skill.status === 'learning' ? ', currently learning' : ''}`}
    >
      {/* SVG ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden
          style={{ transform: 'rotate(-90deg)' }}   /* start at top */
        >
          {/* Background track */}
          <circle
            cx={CX} cy={CY} r={R}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
            fill="none"
          />

          {/* Progress ring */}
          <motion.circle
            cx={CX} cy={CY} r={R}
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={inView ? { strokeDashoffset: targetOffset } : {}}
            transition={{
              duration:  1.2,
              delay:     delay + 0.15,
              ease:      [0.16, 1, 0.3, 1],
            }}
            style={{
              filter:     `drop-shadow(0 0 5px ${color}80)`,
            }}
          />

          {/* Glow ring — brightens on hover */}
          <motion.circle
            cx={CX} cy={CY} r={R}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE, opacity: 0 }}
            animate={inView ? { strokeDashoffset: targetOffset, opacity: 0 } : {}}
            whileHover={{ opacity: 0.3 }}
            transition={{
              strokeDashoffset: { duration: 1.2, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2 },
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden
        >
          {/* Level number — counts up */}
          <motion.span
            className="font-syne font-bold leading-none"
            style={{ fontSize, color }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.4 }}
          >
            <CountUp to={skill.level} inView={inView} delay={delay + 0.4} />
          </motion.span>

          <span
            className="font-mono text-[var(--text-muted)]"
            style={{ fontSize: 8, letterSpacing: '0.08em', marginTop: '1px' }}
          >
            %
          </span>
        </div>

        {/* Learning indicator dot */}
        {skill.status === 'learning' && (
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
            style={{
              background: '#E879F9',
              boxShadow:  '0 0 6px #E879F9',
              animation:  'glowPulse 2s ease-in-out infinite',
            }}
            aria-hidden
          />
        )}
      </div>

      {/* Skill name */}
      <span
        className="font-manrope font-semibold text-center leading-tight text-white/80 group-hover:text-white transition-colors"
        style={{ fontSize: labelSize + 2 }}
      >
        {skill.name}
      </span>

      {/* Description — shown on hover via max-height transition */}
      <div
        className="overflow-hidden text-center max-w-[100px]"
        style={{
          maxHeight: 0,
          transition: 'max-height 0.25s ease, opacity 0.25s ease',
          opacity: 0,
        }}
        aria-hidden
        ref={(el) => {
          if (!el) return
          const parent = el.closest('.group') as HTMLElement | null
          if (!parent) return
          parent.addEventListener('mouseenter', () => {
            el.style.maxHeight = '60px'
            el.style.opacity   = '1'
          })
          parent.addEventListener('mouseleave', () => {
            el.style.maxHeight = '0px'
            el.style.opacity   = '0'
          })
        }}
      >
        <span
          className="font-mono text-[var(--text-muted)] block"
          style={{ fontSize: 8, lineHeight: 1.4, padding: '2px 0' }}
        >
          {skill.description}
        </span>
      </div>
    </motion.div>
  )
}

// ── Count-up display ─────────────────────────────────────────────────────────

function CountUp({
  to,
  inView,
  delay,
}: {
  to:      number
  inView:  boolean
  delay:   number
}) {
  const displayed = useRef(0)
  const elRef     = useRef<HTMLSpanElement>(null)

  // Use framer motion's onUpdate pattern via a motion value
  return (
    <motion.span
      ref={elRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      onAnimationStart={() => {
        if (!inView || !elRef.current) return
        // Animate the number using requestAnimationFrame
        const start     = performance.now()
        const duration  = 1200
        const startDelay = delay * 1000

        setTimeout(() => {
          function tick(now: number) {
            const elapsed  = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased    = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
            const current  = Math.round(eased * to)
            if (elRef.current) elRef.current.textContent = String(current)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }, startDelay)
      }}
    >
      0
    </motion.span>
  )
}
