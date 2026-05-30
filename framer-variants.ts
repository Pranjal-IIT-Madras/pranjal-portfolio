import type { Variants } from 'framer-motion'

/**
 * Shared Framer Motion variants.
 * ─────────────────────────────────────────────────────────────────────────────
 * All animation definitions live here to ensure visual consistency and
 * eliminate repetitive code across components.
 *
 * Usage:
 *   import { fadeInUp, staggerContainer } from '@/lib/animations/framer-variants'
 *   <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
 */

// ── Easing presets ────────────────────────────────────────────────────────────
export const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1]
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1]
export const EASE_SPRING    = [0.34, 1.56, 0.64, 1]
export const EASE_IN_OUT    = [0.4, 0, 0.2, 1]

// ── Core reveal variants ──────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_QUART } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_QUART } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
}

export const fadeInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.25 } },
}

export const fadeInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.25 } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_SPRING } },
  exit:    { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
}

// ── Container / stagger variants ──────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren:  0.07,
      delayChildren:    0.1,
      when: 'beforeChildren',
    },
  },
  exit: { opacity: 0 },
}

export const staggerContainerFast: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
}

export const staggerContainerSlow: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

// ── Hero-specific ─────────────────────────────────────────────────────────────

/** Single character reveal — used in HeroTitle for letter-by-letter animation */
export const charReveal: Variants = {
  hidden:  { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
}

/** Word wrapper — clips overflow so chars slide up from below */
export const charWrapper: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.028 } },
}

/** Role/title swap animation */
export const roleExit: Variants = {
  initial: { y: 0,   opacity: 1 },
  exit:    { y: -30, opacity: 0, transition: { duration: 0.35, ease: EASE_IN_OUT } },
}

export const roleEnter: Variants = {
  initial: { y: 40,  opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
}

// ── Card variants ─────────────────────────────────────────────────────────────

export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
}

export const cardHover: Variants = {
  rest:   { y: 0,  scale: 1,    boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  hover:  { y: -6, scale: 1.02, boxShadow: '0 20px 60px rgba(6,182,212,0.15)' },
}

// ── Section transitions ───────────────────────────────────────────────────────

export const sectionReveal: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// ── Floating animation (non-scroll) ──────────────────────────────────────────

export const floatAnimation = {
  y: [0, -14, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

// ── Loading screen ────────────────────────────────────────────────────────────

export const loaderBarVariants: Variants = {
  hidden:  { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 3.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
