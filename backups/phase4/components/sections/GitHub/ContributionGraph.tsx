'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ContributionCalendar } from '@/types/github'

interface ContributionGraphProps {
  calendar:   ContributionCalendar
  color?:     string
  /** Show month labels above */
  showMonths?: boolean
}

/**
 * ContributionGraph
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a GitHub-style contribution heatmap calendar.
 *
 * Implementation:
 *  - Pure SVG rendering — no canvas, no external charting library
 *  - 52 columns (weeks) × 7 rows (days Mon–Sun)
 *  - Cell size: 11px with 2px gap
 *  - 5 color levels (0–4) tinted from the accent color
 *  - Staggered opacity reveal animation on mount
 *  - Tooltip on hover via <title> elements (accessible)
 *  - Horizontally scrollable on mobile (overflow-x: auto)
 *
 * Color levels:
 *  0 = no contributions (dark base)
 *  1 = 1–2 contributions (20% tint)
 *  2 = 3–4 contributions (40% tint)
 *  3 = 5–6 contributions (70% tint)
 *  4 = 7+ contributions (100% accent color)
 */

const CELL_SIZE = 11
const CELL_GAP  = 2
const CELL_STEP = CELL_SIZE + CELL_GAP

const WEEKS     = 52
const DAYS      = 7

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function levelToOpacity(level: 0 | 1 | 2 | 3 | 4): number {
  const map = { 0: 0, 1: 0.22, 2: 0.45, 3: 0.7, 4: 1 }
  return map[level]
}

export default function ContributionGraph({
  calendar,
  color      = '#06B6D4',
  showMonths = true,
}: ContributionGraphProps) {
  const { weeks, totalContributions } = calendar

  // SVG dimensions
  const topOffset  = showMonths ? 22 : 4
  const svgWidth   = WEEKS  * CELL_STEP - CELL_GAP + 4
  const svgHeight  = DAYS   * CELL_STEP - CELL_GAP + topOffset + 2

  // Build month label positions
  const monthLabels = useMemo(() => {
    const labels: Array<{ x: number; label: string }> = []
    let lastMonth = -1

    weeks.forEach((week, wi) => {
      if (!week.days[0]) return
      const date  = new Date(week.days[0].date)
      const month = date.getMonth()
      if (month !== lastMonth) {
        labels.push({ x: wi * CELL_STEP, label: MONTH_NAMES[month] })
        lastMonth = month
      }
    })

    return labels
  }, [weeks])

  return (
    <div className="w-full">
      {/* Total contributions badge */}
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className="font-syne font-bold"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color }}
        >
          {totalContributions.toLocaleString()}
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
        >
          contributions this year
        </span>
      </div>

      {/* Scrollable SVG container */}
      <div
        className="w-full overflow-x-auto pb-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="img"
        aria-label={`Contribution graph: ${totalContributions} contributions in the last year`}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ display: 'block' }}
        >
          {/* Month labels */}
          {showMonths && monthLabels.map(({ x, label }) => (
            <text
              key={`${label}-${x}`}
              x={x}
              y={12}
              fill="rgba(148,163,184,0.5)"
              style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    8,
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </text>
          ))}

          {/* Day cells */}
          {weeks.map((week, wi) =>
            week.days.map((day, di) => {
              const x       = wi * CELL_STEP
              const y       = di * CELL_STEP + topOffset
              const opacity = levelToOpacity(day.level)
              const fill    = day.level === 0
                ? 'rgba(255,255,255,0.05)'
                : color

              return (
                <motion.rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={2}
                  fill={fill}
                  fillOpacity={opacity}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{
                    opacity: 1,
                    scale:   1,
                    transition: {
                      duration: 0.25,
                      delay:    (wi * DAYS + di) * 0.0008,
                      ease:     'easeOut',
                    },
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                  style={{ transformOrigin: `${x + CELL_SIZE / 2}px ${y + CELL_SIZE / 2}px` }}
                >
                  <title>
                    {day.count > 0
                      ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`
                      : `No contributions on ${day.date}`
                    }
                  </title>
                </motion.rect>
              )
            }),
          )}
        </svg>
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-1.5 mt-3"
        aria-label="Contribution level legend"
      >
        <span className="font-mono text-[8px] text-[var(--text-muted)] tracking-wider mr-1">
          Less
        </span>
        {([0, 1, 2, 3, 4] as const).map((level) => {
          const opacity = levelToOpacity(level)
          return (
            <span
              key={level}
              className="w-[11px] h-[11px] rounded-sm flex-shrink-0"
              style={{
                background:    level === 0 ? 'rgba(255,255,255,0.05)' : color,
                opacity:       level === 0 ? 1 : opacity,
                border:        '1px solid rgba(255,255,255,0.04)',
              }}
              aria-label={`Level ${level}`}
            />
          )
        })}
        <span className="font-mono text-[8px] text-[var(--text-muted)] tracking-wider ml-1">
          More
        </span>
      </div>
    </div>
  )
}
