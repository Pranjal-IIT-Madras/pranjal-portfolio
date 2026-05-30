'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PERSONAL } from '@/constants/personal'

interface HeroRotatingTextProps {
  /** Delay before cycling begins (ms) — lets HeroTitle finish first */
  startDelay?: number
  /** How long each role is displayed (ms) */
  interval?: number
}

/**
 * HeroRotatingText
 * ─────────────────────────────────────────────────────────────────────────────
 * Cycles through PERSONAL.roles with a vertical slide AnimatePresence swap.
 * Exit: current text slides up.
 * Enter: next text rises from below.
 *
 * The outer container has overflow:hidden and a fixed height (1.4em) so
 * entering/exiting texts don't push layout.
 *
 * Performance: only two elements in the DOM at a time.
 */
export default function HeroRotatingText({
  startDelay = 1200,
  interval   = 2800,
}: HeroRotatingTextProps) {
  const roles = PERSONAL.roles
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)

  // Start the cycle after the title finishes animating in
  useEffect(() => {
    const init = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(init)
  }, [startDelay])

  useEffect(() => {
    if (!started) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length)
    }, interval)
    return () => clearInterval(timer)
  }, [started, roles.length, interval])

  return (
    <div
      className="relative"
      style={{
        height:   '1.6em',
        overflow: 'hidden',
      }}
      aria-live="polite"
      aria-label={`Current role: ${roles[index]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y:  0, opacity: 1 }}
          exit={{    y: -32, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 font-manrope font-medium"
          style={{
            color:       'var(--text-secondary)',
            fontSize:    'clamp(0.95rem, 2vw, 1.15rem)',
            letterSpacing: '0.02em',
          }}
        >
          {/* Cyan dot accent */}
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--cyan)] mr-2.5 align-middle"
            style={{ verticalAlign: 'middle', marginBottom: '2px' }}
            aria-hidden
          />
          {roles[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
