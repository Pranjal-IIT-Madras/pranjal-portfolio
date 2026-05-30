'use client'

import type { ReactNode } from 'react'
import ThemeProvider       from './ThemeProvider'
import SmoothScrollProvider from './SmoothScrollProvider'
import GSAPProvider        from './GSAPProvider'
import { CursorProvider }  from '@/components/cursor/CursorContext'

/**
 * AppProviders
 * ─────────────────────────────────────────────────────────────────────────────
 * Composes all context providers in dependency order:
 *   1. Theme     — must wrap everything (CSS class on html)
 *   2. GSAP      — registers plugins before any component uses them
 *   3. SmoothScroll — creates Lenis + hooks into GSAP ticker
 *   4. Cursor    — context for cursor type (consumed by interactive elements)
 *
 * Keeping this in one file makes the provider tree easy to audit.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <GSAPProvider>
        <SmoothScrollProvider>
          <CursorProvider>
            {children}
          </CursorProvider>
        </SmoothScrollProvider>
      </GSAPProvider>
    </ThemeProvider>
  )
}
