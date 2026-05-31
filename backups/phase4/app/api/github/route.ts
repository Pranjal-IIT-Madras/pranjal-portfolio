import { NextResponse } from 'next/server'
import type { GitHubStats, LanguageStat } from '@/types/github'
import {
  FALLBACK_STATS,
  FALLBACK_LANGUAGES,
  generateFallbackCalendar,
} from '@/constants/github-fallback'

/**
 * GET /api/github
 * ─────────────────────────────────────────────────────────────────────────────
 * Proxies GitHub REST API calls server-side.
 * Advantages vs calling GitHub directly from the browser:
 *  - No CORS issues
 *  - GitHub token stays server-side (not exposed to client)
 *  - Response is cached at the edge by Vercel (revalidate: 3600)
 *  - Falls back gracefully to static data if token is missing / rate-limited
 *
 * Returns: { stats, languages, calendar }
 *
 * Environment variable: GITHUB_TOKEN (optional but strongly recommended;
 * unauthenticated requests are rate-limited to 60/hour per IP).
 */

const USERNAME = 'Pranjal-Bhatnagar'
const BASE_URL = 'https://api.github.com'

// Language color map (GitHub's canonical colors)
const LANG_COLORS: Record<string, string> = {
  Python:     '#3572A5',
  'C++':      '#f34b7d',
  C:          '#555555',
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Markdown:   '#083fa1',
  Shell:      '#89e051',
  Jupyter:    '#DA5B0B',
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept:        'application/vnd.github.v3+json',
    'User-Agent':  'pranjal-portfolio/1.0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = 5000,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      headers: githubHeaders(),
      signal:  controller.signal,
      next:    { revalidate: 3600 }, // cache 1 hour at edge
    })
  } finally {
    clearTimeout(timer)
  }
}

export async function GET() {
  try {
    // ── 1. User profile ───────────────────────────────────────────────────────
    const userRes = await fetchWithTimeout(`${BASE_URL}/users/${USERNAME}`)
    if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`)
    const user = await userRes.json()

    // ── 2. All public repos (paginated up to 100) ─────────────────────────────
    const reposRes = await fetchWithTimeout(
      `${BASE_URL}/users/${USERNAME}/repos?per_page=100&type=public`,
    )
    if (!reposRes.ok) throw new Error(`Repos fetch failed: ${reposRes.status}`)
    const repos: Array<{
      stargazers_count: number
      forks_count: number
      language: string | null
      size: number
    }> = await reposRes.json()

    // ── 3. Aggregate stats ────────────────────────────────────────────────────
    let totalStars   = 0
    let totalForks   = 0
    const langBytes: Record<string, number> = {}

    for (const repo of repos) {
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
      if (repo.language) {
        langBytes[repo.language] = (langBytes[repo.language] ?? 0) + (repo.size * 1024)
      }
    }

    const stats: GitHubStats = {
      totalRepos:    user.public_repos   ?? FALLBACK_STATS.totalRepos,
      totalStars,
      totalForks,
      totalCommits:  FALLBACK_STATS.totalCommits, // commit count requires GraphQL
      followers:     user.followers      ?? FALLBACK_STATS.followers,
      following:     user.following      ?? FALLBACK_STATS.following,
      contributions: FALLBACK_STATS.contributions,
      streak:        FALLBACK_STATS.streak,
    }

    // ── 4. Language breakdown ─────────────────────────────────────────────────
    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1
    const languages: LanguageStat[] = Object.entries(langBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
        color:      LANG_COLORS[name] ?? '#8B5CF6',
      }))

    // Add "Other" bucket if languages > 6
    const shownPct = languages.reduce((s, l) => s + l.percentage, 0)
    if (shownPct < 100 && languages.length >= 6) {
      languages.push({
        name:       'Other',
        bytes:      0,
        percentage: 100 - shownPct,
        color:      '#475569',
      })
    }

    // ── 5. Contribution calendar (fallback — GraphQL token needed for real) ───
    const calendar = generateFallbackCalendar()

    return NextResponse.json(
      { stats, languages, calendar },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    )
  } catch (err) {
    console.error('[/api/github] Error:', err)

    // Graceful fallback — the UI is always functional
    return NextResponse.json(
      {
        stats:     FALLBACK_STATS,
        languages: FALLBACK_LANGUAGES,
        calendar:  generateFallbackCalendar(),
        fallback:  true,
      },
      { status: 200 },
    )
  }
}
