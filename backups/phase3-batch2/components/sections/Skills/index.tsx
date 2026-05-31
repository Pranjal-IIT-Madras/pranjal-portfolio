'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import SkillCategory from './SkillCategory'
import { SKILL_CATEGORIES } from '@/constants/skills'
import { useCursor } from '@/components/cursor/CursorContext'
import { cn } from '@/lib/utils/cn'

/**
 * SkillsSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive tabbed skill visualization.
 *
 * Layout:
 *   1. Section header
 *   2. Category tab bar (horizontal pill tabs, color-coded)
 *   3. SkillCategory panel — AnimatePresence swaps categories
 *   4. Bottom bar: total skills count + average proficiency across all categories
 *
 * NO boring progress bars. Every skill is a circular SVG orb.
 * The tab bar itself uses the category's accent color for the active indicator.
 *
 * Accessibility:
 *  - role="tablist" / role="tab" / role="tabpanel" ARIA pattern
 *  - aria-selected on active tab
 *  - keyboard navigation: ArrowLeft/ArrowRight cycle tabs
 */

export default function SkillsSection() {
  const [activeId, setActiveId] = useState(SKILL_CATEGORIES[0].id)
  const { enterButton, leaveAll } = useCursor()

  const activeCategory = SKILL_CATEGORIES.find((c) => c.id === activeId)!

  // Summary stats across all categories
  const allSkills     = SKILL_CATEGORIES.flatMap((c) => c.skills)
  const totalSkills   = allSkills.length
  const avgLevel      = Math.round(allSkills.reduce((s, sk) => s + sk.level, 0) / totalSkills)
  const learningCount = allSkills.filter((s) => s.status === 'learning').length

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    const len = SKILL_CATEGORIES.length
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActiveId(SKILL_CATEGORIES[(currentIndex + 1) % len].id)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveId(SKILL_CATEGORIES[(currentIndex - 1 + len) % len].id)
    }
  }

  return (
    <section
      id="skills"
      aria-label="Technical skills"
      style={{ padding: 'var(--section-py) var(--section-px)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <SectionHeader
          index="04"
          label="Skills"
          title="Technical Arsenal"
          description="Honest proficiency levels — not aspirational marketing. Each ring reflects daily practice and real project experience."
          className="mb-12"
        />

        {/* ── Tab bar ── */}
        <div
          className="flex flex-wrap gap-2 mb-10 pb-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          role="tablist"
          aria-label="Skill categories"
        >
          {SKILL_CATEGORIES.map((cat, i) => {
            const isActive = cat.id === activeId
            return (
              <motion.button
                key={cat.id}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveId(cat.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onMouseEnter={enterButton}
                onMouseLeave={leaveAll}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'relative px-4 py-2 rounded-full font-manrope font-medium text-sm',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
                  isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-white/70',
                )}
                style={{
                  background: isActive ? `${cat.color}18` : 'transparent',
                  border:     `1px solid ${isActive ? cat.color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {cat.shortLabel}

                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="tab-dot"
                    className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    aria-hidden
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── Category panel — swaps with AnimatePresence ── */}
        <div
          id={`panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="min-h-[320px]"
        >
          <AnimatePresence mode="wait">
            <SkillCategory
              key={activeCategory.id}
              category={activeCategory}
              active
            />
          </AnimatePresence>
        </div>

        {/* ── Summary bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-14 rounded-2xl p-5 flex flex-wrap gap-6 items-center justify-between"
          style={{
            background:  'rgba(15,23,42,0.5)',
            border:      '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
          role="complementary"
          aria-label="Skills summary"
        >
          {[
            { value: totalSkills,    label: 'Total skills tracked',    color: '#06B6D4' },
            { value: `${avgLevel}%`, label: 'Average proficiency',     color: '#3B82F6' },
            { value: learningCount,  label: 'Actively exploring',      color: '#E879F9' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span
                className="font-syne font-bold"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: stat.color }}
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </span>
              <span
                className="font-manrope text-[var(--text-muted)]"
                style={{ fontSize: '0.82rem' }}
                aria-hidden
              >
                {stat.label}
              </span>
            </div>
          ))}

          {/* Note about levels */}
          <p
            className="font-mono text-[var(--text-muted)] text-center w-full sm:w-auto sm:text-right"
            style={{ fontSize: '10px', letterSpacing: '0.04em' }}
          >
            Levels reflect honest self-assessment based on real project work
          </p>
        </motion.div>

      </div>
    </section>
  )
}
