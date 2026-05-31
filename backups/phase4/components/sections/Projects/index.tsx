'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import ProjectCard   from './ProjectCard'
import ProjectModal  from './ProjectModal'
import { SORTED_PROJECTS, type Project, type ProjectCategory } from '@/constants/projects'
import { useCursor } from '@/components/cursor/CursorContext'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'
import { cn } from '@/lib/utils/cn'

/**
 * ProjectsSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout:
 *  1. Section header
 *  2. Category filter tabs (All / Data Science / Practice / Education)
 *  3. Responsive grid — featured projects span 2 cols on md+
 *  4. ProjectModal renders over the page (portal-less, z-50)
 *
 * Category filter uses AnimatePresence + layout animations so cards
 * reposition smoothly when the filter changes.
 *
 * The "All" tab always shows all 5 projects.
 * Featured projects appear first regardless of filter.
 *
 * Accessibility:
 *  - Filter tabs: role="tablist" / role="tab" / aria-selected
 *  - Grid: role="list" / role="listitem"
 *  - Modal: managed by ProjectModal (role="dialog")
 */

const FILTER_TABS = [
  { id: 'all',          label: 'All Projects' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'practice',     label: 'C++ Practice' },
  { id: 'education',    label: 'Education' },
] as const

type FilterId = (typeof FILTER_TABS)[number]['id']

export default function ProjectsSection() {
  const [filter,        setFilter]       = useState<FilterId>('all')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const { enterButton, leaveAll } = useCursor()

  const filtered = filter === 'all'
    ? SORTED_PROJECTS
    : SORTED_PROJECTS.filter((p) => p.category === (filter as ProjectCategory))

  const handleOpen  = useCallback((p: Project) => setActiveProject(p), [])
  const handleClose = useCallback(()            => setActiveProject(null), [])

  return (
    <>
      <section
        id="projects"
        aria-label="Featured projects"
        style={{ padding: 'var(--section-py) var(--section-px)' }}
      >
        <div className="max-w-[1280px] mx-auto">

          {/* Section header */}
          <SectionHeader
            index="07"
            label="Projects"
            title="Built & Documented"
            description="Real repositories from GitHub — each one a chapter in the learning journey. No fabricated projects, no inflated descriptions."
            className="mb-10"
          />

          {/* ── Filter tabs ── */}
          <div
            className="flex flex-wrap gap-2 mb-10 pb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            role="tablist"
            aria-label="Filter projects by category"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = filter === tab.id
              const count    = tab.id === 'all'
                ? SORTED_PROJECTS.length
                : SORTED_PROJECTS.filter((p) => p.category === tab.id).length

              return (
                <motion.button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setFilter(tab.id)}
                  onMouseEnter={enterButton}
                  onMouseLeave={leaveAll}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full font-manrope font-medium text-sm',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
                    isActive
                      ? 'text-[var(--cyan)] bg-[var(--cyan)]/10 border border-[var(--cyan)]/35'
                      : 'text-[var(--text-muted)] hover:text-white/70 bg-transparent border border-white/[0.06]',
                  )}
                >
                  {tab.label}
                  <span
                    className="font-mono text-[9px] rounded-full px-1.5 py-0.5"
                    style={{
                      background: isActive ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.07)',
                      color:      isActive ? 'var(--cyan)' : 'var(--text-muted)',
                    }}
                  >
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* ── Projects grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                role="list"
                aria-label={`${filter === 'all' ? 'All' : filter} projects`}
              >
                {filtered.map((project, i) => (
                  <motion.li
                    key={project.id}
                    variants={itemVariants}
                    role="listitem"
                    className={cn(project.featured && 'md:col-span-2')}
                    layout
                  >
                    <ProjectCard
                      project={project}
                      delay={i * 0.05}
                      onOpen={handleOpen}
                      featured={project.featured}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </AnimatePresence>

          {/* ── Empty state ── */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-manrope text-[var(--text-muted)]">
                No projects in this category yet.
              </p>
            </div>
          )}

          {/* ── GitHub CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/Pranjal-Bhatnagar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-manrope font-medium text-sm px-6 py-3 rounded-full transition-all"
              style={{
                color:      'var(--text-secondary)',
                background: 'rgba(255,255,255,0.04)',
                border:     '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color       = 'var(--cyan)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.4)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color       = 'var(--text-secondary)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              View all repositories on GitHub →
            </a>
          </motion.div>

        </div>
      </section>

      {/* Modal — rendered at section level, z-50 */}
      <ProjectModal project={activeProject} onClose={handleClose} />
    </>
  )
}
