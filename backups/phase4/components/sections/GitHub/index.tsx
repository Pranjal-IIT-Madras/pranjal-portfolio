'use client'

import { motion } from 'framer-motion'
import {
  GitFork,
  Star,
  GitCommitHorizontal,
  BookOpen,
  Users,
  Flame,
} from 'lucide-react'
import SectionHeader     from '@/components/ui/SectionHeader'
import StatCard          from './StatCard'
import ContributionGraph from './ContributionGraph'
import LanguageBar       from './LanguageBar'
import { useGitHubData } from '@/hooks/useGitHubData'
import { GITHUB_USERNAME } from '@/constants/projects'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'

/**
 * GitHubSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders GitHub analytics fetched from /api/github (SWR-cached).
 *
 * Layout:
 *   1. Section header
 *   2. 3-column stat card grid (repos, commits, streak, stars, followers, forks)
 *   3. Two-column panel: contribution graph (left) + language bar (right)
 *   4. GitHub profile CTA
 *
 * Loading state: stat cards use a skeleton shimmer.
 * Fallback state: shown with a subtle "using cached data" badge.
 *
 * Data: useGitHubData() always returns a valid object — never null.
 */

export default function GitHubSection() {
  const { data, isLoading } = useGitHubData()
  const { stats, languages, calendar, fallback } = data

  const STAT_CARDS = [
    {
      icon:  BookOpen,
      label: 'Repositories',
      value: stats.totalRepos,
      color: '#06B6D4',
      delay: 0,
      description: 'Public repos on GitHub',
    },
    {
      icon:  GitCommitHorizontal,
      label: 'Contributions',
      value: stats.contributions,
      color: '#3B82F6',
      delay: 0.07,
      description: 'Contributions this year',
    },
    {
      icon:  Flame,
      label: 'Current Streak',
      value: stats.streak,
      suffix: 'd',
      color: '#8B5CF6',
      delay: 0.14,
      description: 'Day streak',
    },
    {
      icon:  Star,
      label: 'Total Stars',
      value: stats.totalStars,
      color: '#E8D5A3',
      delay: 0.21,
      description: 'Stars received',
    },
    {
      icon:  Users,
      label: 'Followers',
      value: stats.followers,
      color: '#38BDF8',
      delay: 0.28,
      description: `@${GITHUB_USERNAME}`,
    },
    {
      icon:  GitFork,
      label: 'Total Forks',
      value: stats.totalForks,
      color: '#818CF8',
      delay: 0.35,
      description: 'Forks across repos',
    },
  ] as const

  return (
    <section
      id="github"
      aria-label="GitHub analytics"
      style={{ padding: 'var(--section-py) var(--section-px)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-12">
          <SectionHeader
            index="08"
            label="GitHub"
            title="Open Source Activity"
            description="Real-time stats from the GitHub API — tracking consistency, languages, and project growth."
          />

          {/* Fallback badge */}
          {fallback && (
            <span
              className="flex-shrink-0 font-mono text-[9px] tracking-[0.15em] uppercase rounded-full px-3 py-1.5 self-start mt-1"
              style={{
                color:      'rgba(148,163,184,0.6)',
                background: 'rgba(148,163,184,0.06)',
                border:     '1px solid rgba(148,163,184,0.12)',
              }}
              aria-label="Using cached data"
            >
              Cached data
            </span>
          )}
        </div>

        {/* ── Stat cards grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          role="list"
          aria-label="GitHub statistics"
        >
          {STAT_CARDS.map((card) => (
            <motion.div key={card.label} variants={itemVariants} role="listitem">
              {isLoading ? (
                <div
                  className="rounded-2xl h-[130px] shimmer"
                  style={{
                    background: 'rgba(15,23,42,0.55)',
                    border:     '1px solid rgba(255,255,255,0.06)',
                  }}
                  aria-label="Loading..."
                />
              ) : (
                <StatCard
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  suffix={'suffix' in card ? card.suffix : undefined}
                  color={card.color}
                  delay={card.delay}
                  description={card.description}
                  countUp
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── Two-column analytics panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">

          {/* Contribution graph */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6"
            style={{
              background:     'rgba(15,23,42,0.55)',
              backdropFilter: 'blur(18px)',
              border:         '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <h3
              className="font-syne font-bold text-white mb-5"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)' }}
            >
              Contribution Activity
            </h3>

            {isLoading ? (
              <div
                className="rounded-xl shimmer"
                style={{ height: '160px', background: 'rgba(255,255,255,0.04)' }}
                aria-label="Loading contribution graph..."
              />
            ) : (
              <ContributionGraph
                calendar={calendar}
                color="#06B6D4"
                showMonths
              />
            )}
          </motion.div>

          {/* Language breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{
              background:     'rgba(15,23,42,0.55)',
              backdropFilter: 'blur(18px)',
              border:         '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <h3
              className="font-syne font-bold text-white mb-5"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)' }}
            >
              Languages
            </h3>

            {isLoading ? (
              <div
                className="rounded-xl shimmer"
                style={{ height: '160px', background: 'rgba(255,255,255,0.04)' }}
                aria-label="Loading language data..."
              />
            ) : (
              <LanguageBar languages={languages} />
            )}
          </motion.div>
        </div>

        {/* ── GitHub CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-full px-6 py-3 font-manrope font-medium text-sm transition-all"
            style={{
              background:  'rgba(255,255,255,0.04)',
              border:      '1px solid rgba(255,255,255,0.1)',
              color:       'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color       = 'var(--cyan)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.4)'
              ;(e.currentTarget as HTMLElement).style.background  = 'rgba(6,182,212,0.05)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color       = 'var(--text-secondary)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
              ;(e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.04)'
            }}
          >
            <span
              className="w-6 h-6 rounded-full bg-[var(--cyan)]/10 flex items-center justify-center text-[var(--cyan)] text-xs"
              aria-hidden
            >
              ↗
            </span>
            View @{GITHUB_USERNAME} on GitHub
          </a>
        </motion.div>

      </div>
    </section>
  )
}
