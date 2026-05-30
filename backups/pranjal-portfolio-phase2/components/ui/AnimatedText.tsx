'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils/cn'

// ── Character reveal ──────────────────────────────────────────────────────────

interface CharRevealProps {
  text:        string
  as?:         ElementType
  className?:  string
  delay?:      number
  /** Stagger per character in seconds */
  stagger?:    number
  /** If false, starts immediately without IntersectionObserver */
  waitInView?: boolean
}

/**
 * CharReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders text with each character sliding up from below a clip boundary.
 * Each character is wrapped in an overflow:hidden span so the motion is clean.
 *
 * Used in: Hero section for "PRANJAL BHATNAGAR".
 */
export function CharReveal({
  text,
  as: Tag = 'span',
  className,
  delay     = 0,
  stagger   = 0.032,
  waitInView = false,
}: CharRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, {
    threshold: 0.3,
    once: true,
  })

  const shouldAnimate = waitInView ? inView : true

  const chars = text.split('')

  return (
    <Tag
      ref={ref as React.Ref<any>}
      className={cn('inline-block', className)}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={
              shouldAnimate
                ? { y: '0%', opacity: 1 }
                : {}
            }
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// ── Word reveal ───────────────────────────────────────────────────────────────

interface WordRevealProps {
  text:        string
  as?:         ElementType
  className?:  string
  delay?:      number
  stagger?:    number
  waitInView?: boolean
}

/**
 * WordReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Reveals each word as a unit (faster than CharReveal for body copy).
 * Used in section headers, descriptions, and about section.
 */
export function WordReveal({
  text,
  as: Tag = 'p',
  className,
  delay     = 0,
  stagger   = 0.06,
  waitInView = true,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, {
    threshold: 0.2,
    once: true,
  })

  const shouldAnimate = waitInView ? inView : true
  const words = text.split(' ')

  return (
    <Tag
      ref={ref as React.Ref<any>}
      className={cn('inline', className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.26em]"
          style={{ verticalAlign: 'bottom' }}
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            animate={shouldAnimate ? { y: '0%', opacity: 1 } : {}}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// ── Fade line ────────────────────────────────────────────────────────────────

interface FadeLineProps {
  children: ReactNode
  as?:      ElementType
  delay?:   number
  className?: string
  waitInView?: boolean
}

/**
 * FadeLine
 * Simple opacity + Y fade for a single block element.
 * Lighter alternative to CharReveal for labels and captions.
 */
export function FadeLine({
  children,
  as: Tag = 'div',
  delay    = 0,
  className,
  waitInView = true,
}: FadeLineProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, {
    threshold: 0.2,
    once: true,
  })

  const shouldAnimate = waitInView ? inView : true

  return (
    <motion.div
      ref={ref as React.Ref<any>}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
