import { Syne, Manrope, JetBrains_Mono } from 'next/font/google'

/**
 * Syne — geometric, editorial, futuristic display typeface.
 * Used for: headings, hero text, section titles, logo.
 * Rationale: Unconventional letterforms give the cosmic theme authenticity.
 */
export const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

/**
 * Manrope — clean, modern, humanist sans-serif.
 * Used for: body text, descriptions, cards, UI labels.
 * Rationale: High legibility at small sizes; distinct from overused Inter/Roboto.
 */
export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

/**
 * JetBrains Mono — premium developer monospace.
 * Used for: terminal section, code snippets, stats, technical labels.
 * Rationale: Consistent with developer identity; ligatures add visual interest.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false, // lower priority — used in specific sections
})
