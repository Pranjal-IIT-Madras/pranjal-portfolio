'use client'

import useSWR from 'swr'
import type { GitHubStats, LanguageStat, ContributionCalendar } from '@/types/github'
import {
  FALLBACK_STATS,
  FALLBACK_LANGUAGES,
  generateFallbackCalendar,
} from '@/constants/github-fallback'

interface GitHubData {
  stats:     GitHubStats
  languages: LanguageStat[]
  calendar:  ContributionCalendar
  /** True when serving static fallback (API unavailable) */
  fallback:  boolean
}

interface UseGitHubDataResult {
  data:      GitHubData
  isLoading: boolean
  isError:   boolean
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })

/**
 * useGitHubData
 * ─────────────────────────────────────────────────────────────────────────────
 * SWR hook that fetches from the /api/github proxy route.
 *
 * Always returns a valid data object — falls back to static constants
 * if the API fails or is loading. This guarantees the GitHub section
 * always renders, never shows a blank state.
 *
 * Cache: SWR's default de-duplication + our API route's 1-hour edge cache
 * means at most one real API call per visitor per hour.
 */
export function useGitHubData(): UseGitHubDataResult {
  const { data, error, isLoading } = useSWR<GitHubData>('/api/github', fetcher, {
    revalidateOnFocus:       false,
    revalidateOnReconnect:   true,
    dedupingInterval:        60 * 60 * 1000, // 1 hour
    errorRetryCount:         2,
    errorRetryInterval:      5000,
  })

  // Always return a usable data object
  const safeData: GitHubData = data ?? {
    stats:     FALLBACK_STATS,
    languages: FALLBACK_LANGUAGES,
    calendar:  generateFallbackCalendar(),
    fallback:  true,
  }

  return {
    data:      safeData,
    isLoading,
    isError:   !!error,
  }
}
