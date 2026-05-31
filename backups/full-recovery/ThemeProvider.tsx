'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps next-themes. Deep Space (dark) is the canonical look;
 * light mode is a readable alternative — not the primary experience.
 *
 * attribute='class' means next-themes adds 'dark' or 'light' to <html>.
 * Our globals.css uses .light { } overrides; dark styles are the default.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
      themes={['dark', 'light']}
    >
      {children}
    </NextThemeProvider>
  )
}
