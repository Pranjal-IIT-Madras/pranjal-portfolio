import type { Variants, Transition, TargetAndTransition } from 'framer-motion'

export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

export interface AnimationConfig {
  variants: Variants
  transition?: Transition
  initial?: string
  animate?: string
  exit?: string
}

export interface StaggerConfig {
  staggerChildren: number
  delayChildren?: number
}

// ─── Shared Variant Factories ─────────────────────────────────────────────────

export function createFadeInVariants(
  direction: AnimationDirection = 'up',
  distance = 30,
): Variants {
  const hidden: TargetAndTransition = { opacity: 0 }
  const visible: TargetAndTransition = { opacity: 1 }

  switch (direction) {
    case 'up':
      hidden.y = distance
      visible.y = 0
      break
    case 'down':
      hidden.y = -distance
      visible.y = 0
      break
    case 'left':
      hidden.x = -distance
      visible.x = 0
      break
    case 'right':
      hidden.x = distance
      visible.x = 0
      break
    case 'scale':
      hidden.scale = 0.85
      visible.scale = 1
      break
    case 'fade':
    default:
      break
  }

  return { hidden, visible }
}

// ─── Common Shared Variants ───────────────────────────────────────────────────

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const glowVariants: Variants = {
  idle: { scale: 1, filter: 'blur(8px) brightness(1)' },
  hovered: { scale: 1.2, filter: 'blur(12px) brightness(1.4)' },
}
