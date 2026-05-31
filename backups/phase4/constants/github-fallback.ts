/**
 * constants/github-fallback.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Static fallback shown when the GitHub API is rate-limited, unavailable,
 * or the token is not configured.
 *
 * Update these numbers periodically to keep them roughly accurate.
 * Real-time values are always preferred via the API route.
 */

import type { GitHubStats, LanguageStat, ContributionCalendar } from '@/types/github'

export const FALLBACK_STATS: GitHubStats = {
  totalRepos:    12,
  totalStars:     4,
  totalForks:     2,
  totalCommits:  180,
  followers:      8,
  following:     12,
  contributions: 320,
  streak:         7,
}

export const FALLBACK_LANGUAGES: LanguageStat[] = [
  { name: 'Python',     bytes: 68000, percentage: 42, color: '#3572A5' },
  { name: 'C++',        bytes: 45000, percentage: 28, color: '#f34b7d' },
  { name: 'Markdown',   bytes: 22000, percentage: 14, color: '#083fa1' },
  { name: 'HTML',       bytes: 14000, percentage:  9, color: '#e34c26' },
  { name: 'JavaScript', bytes:  7000, percentage:  4, color: '#f1e05a' },
  { name: 'Other',      bytes:  4000, percentage:  3, color: '#8B5CF6' },
]

/**
 * generateFallbackCalendar
 * Produces 52 weeks × 7 days of seeded-random contribution data.
 * Used as a visual placeholder when real contribution data is unavailable.
 * The seed produces a realistic-looking distribution — not all zeros.
 */
export function generateFallbackCalendar(): ContributionCalendar {
  const weeks = []
  let totalContributions = 0

  // Pseudo-random generator with fixed seed for determinism
  let seed = 42
  function rand() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    return (seed >>> 0) / 0xffffffff
  }

  const today = new Date()

  for (let w = 51; w >= 0; w--) {
    const days = []
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(today.getDate() - w * 7 - d)

      // Higher probability on weekdays
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const baseProbability = isWeekend ? 0.2 : 0.55
      const r = rand()

      let count = 0
      let level: 0 | 1 | 2 | 3 | 4 = 0

      if (r < baseProbability) {
        count = Math.floor(rand() * 8) + 1
        level  = count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4
      }

      totalContributions += count
      days.push({
        date:  date.toISOString().split('T')[0],
        count,
        level,
      })
    }
    weeks.push({ days })
  }

  return { totalContributions, weeks }
}
