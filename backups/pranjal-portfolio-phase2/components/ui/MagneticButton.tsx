'use client'

import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils/cn'
import { useCursor } from '@/components/cursor/CursorContext'
import { useHasFinePointer } from '@/hooks/useMediaQuery'

interface MagneticButtonProps {
  children:    ReactNode
  className?:  string
  /** Magnetic pull strength 0-1 (default 0.38) */
  strength?:   number
  /** If true the button has a glow border */
  variant?:    'primary' | 'secondary' | 'ghost'
  onClick?:    () => void
  href?:       string
  external?:   boolean
  ariaLabel?:  string
  disabled?:   boolean
}

/**
 * MagneticButton
 * ─────────────────────────────────────────────────────────────────────────────
 * A button that magnetically pulls toward the cursor when hovered.
 *
 * Implementation:
 *  - onMouseMove computes cursor position relative to button center
 *  - gsap.quickTo() translates the button smoothly (no tween creation overhead)
 *  - onMouseLeave springs the button back to origin
 *
 * Performance: all transforms are GPU-composited. No layout properties touched.
 * Magnetic effect is disabled on coarse-pointer (touch) devices.
 *
 * Renders as <a> when href is provided, otherwise <button>.
 */
export default function MagneticButton({
  children,
  className,
  strength  = 0.38,
  variant   = 'primary',
  onClick,
  href,
  external  = false,
  ariaLabel,
  disabled  = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null)
  const { enterButton, leaveAll } = useCursor()
  const hasFine = useHasFinePointer()

  // quickTo refs — created once on first hover
  const quickX = useRef<((v: number) => gsap.core.Tween) | null>(null)
  const quickY = useRef<((v: number) => gsap.core.Tween) | null>(null)

  const initQuickTo = useCallback(() => {
    if (!buttonRef.current || quickX.current) return
    quickX.current = gsap.quickTo(buttonRef.current, 'x', {
      duration: 0.4,
      ease: 'power3.out',
    })
    quickY.current = gsap.quickTo(buttonRef.current, 'y', {
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!hasFine || !buttonRef.current) return
    initQuickTo()

    const rect = buttonRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) * strength
    const dy   = (e.clientY - cy) * strength

    quickX.current?.(dx)
    quickY.current?.(dy)
  }, [hasFine, strength, initQuickTo])

  const handleMouseEnter = useCallback(() => {
    enterButton()
    initQuickTo()
  }, [enterButton, initQuickTo])

  const handleMouseLeave = useCallback(() => {
    leaveAll()
    if (!buttonRef.current) return
    gsap.to(buttonRef.current, {
      x: 0, y: 0,
      duration: 0.5,
      ease: 'elastic.out(1.1, 0.4)',
    })
  }, [leaveAll])

  const baseClass = cn(
    // Layout
    'relative inline-flex items-center justify-center gap-2',
    'px-7 py-3.5 rounded-full',
    // Text
    'font-manrope font-semibold text-sm tracking-wide',
    // Transition (background / border only — not transform, which GSAP owns)
    'transition-colors duration-200',
    // Focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
    // Disabled
    disabled && 'opacity-40 pointer-events-none',

    // Variant styles
    variant === 'primary' && [
      'bg-gradient-to-r from-[var(--cyan)] to-[var(--blue)]',
      'text-[#050816]',
      'shadow-glow-cyan',
      'hover:shadow-glow-blue',
    ],
    variant === 'secondary' && [
      'bg-transparent text-white/80',
      'border border-white/20 hover:border-[var(--cyan)]/60',
      'hover:text-white hover:bg-white/5',
    ],
    variant === 'ghost' && [
      'bg-transparent text-[var(--cyan)]',
      'border border-[var(--cyan)]/30 hover:border-[var(--cyan)]/70',
      'hover:bg-[var(--cyan)]/5',
    ],
    className,
  )

  const sharedProps = {
    ref: buttonRef as React.Ref<any>,
    className: baseClass,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-label': ariaLabel,
    'aria-disabled': disabled,
  }

  if (href) {
    return (
      <a
        {...sharedProps}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      {...sharedProps}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}
