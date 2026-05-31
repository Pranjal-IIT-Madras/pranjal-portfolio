'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { LanguageStat } from '@/types/github'
import { useInView } from '@/hooks/useInView'

interface LanguageBarProps {
  languages: LanguageStat[]
}

/**
 * LanguageBar
 * ─────────────────────────────────────────────────────────────────────────────
 * Horizontal stacked bar chart for repository language breakdown.
 *
 * Visual:
 * ┌───────────────────────────────────────────────────────┐
 * │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← stacked bar
 * └───────────────────────────────────────────────────────┘
 * ● Python 42%  ● C++ 28%  ● HTML 9% ...                  ← legend
 *
 * Animation: each segment's width animates from 0% → percentage%
 * when the component enters the viewport (staggered).
 *
 * Accessibility: role="img" with aria-label describing distribution.
 */
export default function LanguageBar({ languages }: LanguageBarProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { threshold: 0.4, once: true })

  const description = languages
    .map((l) => `${l.name} ${l.percentage}%`)
    .join(', ')

  return (
    <div ref={ref} role="img" aria-label={`Language breakdown: ${description}`}>

      {/* Stacked bar */}
      <div
        className="flex w-full overflow-hidden"
        style={{
          height:       '8px',
          borderRadius: '4px',
          background:   'rgba(255,255,255,0.06)',
          marginBottom: '16px',
        }}
        aria-hidden
      >
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{
              duration:  0.9,
              delay:     0.05 + i * 0.07,
              ease:      [0.16, 1, 0.3, 1],
            }}
            style={{
              width:           `${lang.percentage}%`,
              background:      lang.color,
              height:          '100%',
              transformOrigin: 'left',
              flexShrink:      0,
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Language legend grid */}
      <div
        className="grid gap-x-4 gap-y-2.5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
        role="list"
        aria-label="Language legend"
      >
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            role="listitem"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
          >
            {/* Color swatch */}
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: lang.color, boxShadow: `0 0 5px ${lang.color}80` }}
              aria-hidden
            />

            {/* Name */}
            <span
              className="font-manrope font-medium text-white/75 truncate"
              style={{ fontSize: '0.8rem' }}
            >
              {lang.name}
            </span>

            {/* Percentage */}
            <span
              className="ml-auto font-mono flex-shrink-0"
              style={{ fontSize: '0.75rem', color: lang.color }}
            >
              {lang.percentage}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
