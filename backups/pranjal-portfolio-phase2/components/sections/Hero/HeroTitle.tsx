'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * HeroTitle
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders "PRANJAL BHATNAGAR" with an editorial character-by-character
 * slide-up reveal using pure GSAP (not Framer Motion) so the animation
 * can start precisely after the loading screen completes.
 *
 * Two-line layout:
 *   PRANJAL
 *   BHATNAGAR
 *
 * Characters are pre-split into span wrappers with overflow:hidden.
 * GSAP animates the inner span's yPercent from 110 → 0 with stagger.
 *
 * The gradient fill (cyan → blue → purple) sweeps across the full name
 * via backgroundClip: 'text' on the container.
 */

const LINE1 = 'PRANJAL'
const LINE2 = 'BHATNAGAR'

interface HeroTitleProps {
  delay?: number
}

export default function HeroTitle({ delay = 0 }: HeroTitleProps) {
  const wrapRef  = useRef<HTMLHeadingElement>(null)
  const charsRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    if (!wrapRef.current || charsRef.current.length === 0) return

    // Set all chars invisible before animating
    gsap.set(charsRef.current, { yPercent: 110 })

    gsap.to(charsRef.current, {
      yPercent: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.035,
      delay: delay,
    })

    // After chars arrive, animate in a subtle gradient shimmer
    gsap.fromTo(
      wrapRef.current,
      { backgroundPosition: '200% center' },
      {
        backgroundPosition: '0% center',
        duration: 2,
        delay: delay + 0.6,
        ease: 'power2.inOut',
      },
    )
  }, [delay])

  let charIndex = 0

  function makeChars(text: string, colorClass: string) {
    return text.split('').map((char, i) => {
      const idx = charIndex++
      return (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
          aria-hidden
        >
          <span
            ref={(el) => {
              if (el) charsRef.current[idx] = el
            }}
            className={`inline-block ${colorClass}`}
          >
            {char}
          </span>
        </span>
      )
    })
  }

  return (
    <h1
      ref={wrapRef}
      aria-label="Pranjal Bhatnagar"
      className="hero-display font-syne select-none"
      style={{
        display:         'block',
        backgroundSize:  '200% auto',
      }}
    >
      {/* Line 1 */}
      <span className="block">
        {makeChars(LINE1, 'text-white')}
      </span>

      {/* Line 2 — gradient version */}
      <span
        className="block text-gradient-full"
        style={{
          paddingBottom: '0.05em', // prevents gradient clip cutting descenders
        }}
      >
        {makeChars(LINE2, '')}
      </span>
    </h1>
  )
}
