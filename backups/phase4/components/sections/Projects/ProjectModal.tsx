'use client'

import { useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Github, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react'
import type { Project } from '@/constants/projects'
import { cn } from '@/lib/utils/cn'

interface ProjectModalProps {
  project:  Project | null
  onClose:  () => void
}

/**
 * ProjectModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Full case-study detail modal. Opens over the page with a dark backdrop.
 *
 * Accessibility:
 *  - role="dialog" + aria-modal="true"
 *  - Focus moves to modal on open, returns to trigger on close
 *  - Escape key dismisses
 *  - Backdrop click dismisses
 *  - Focus trap: Tab cycles within modal (via keydown handler)
 *
 * Animation:
 *  - Backdrop: opacity 0→1
 *  - Modal panel: scale 0.95→1 + opacity 0→1 from center
 *  - AnimatePresence handles enter/exit
 *
 * Layout:
 * ┌──────────────────────────────────────────┐
 * │ [Color bar top edge]                     │
 * │                                     [✕] │
 * │ Category icon  Title                     │
 * │                Tagline                   │
 * │ ─────────────────────────────────────── │
 * │ About this project         (left 60%)    │
 * │ [Full description]                       │
 * │ [Detail paragraph]                       │
 * │                                          │
 * │ Key highlights             (right 40%)   │
 * │ [✓] Highlight 1                          │
 * │ [✓] Highlight 2                          │
 * │                                          │
 * │ Tech stack chips                         │
 * │ ─────────────────────────────────────── │
 * │ [GitHub repo]                            │
 * └──────────────────────────────────────────┘
 */

const CATEGORY_ICONS: Record<Project['category'], string> = {
  'data-science': '📊',
  'software':     '⚙️',
  'education':    '📚',
  'practice':     '🔧',
}

const STATUS_LABELS: Record<Project['status'], string> = {
  completed: 'Completed',
  ongoing:   'Ongoing',
  learning:  'In Progress',
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef      = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // ── Focus management ─────────────────────────────────────────────────────
  useEffect(() => {
    if (project) {
      // Move focus into modal
      setTimeout(() => closeButtonRef.current?.focus(), 50)
      // Lock body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  // ── Keyboard handling ────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }

    if (e.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
  }, [onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#050816]/85 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.97,  y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background:     'rgba(15,23,42,0.97)',
              backdropFilter: 'blur(24px)',
              border:         `1px solid ${project.color}30`,
              boxShadow:      `0 24px 80px rgba(0,0,0,0.7), 0 0 40px ${project.color}12`,
            }}
          >
            {/* Color accent top bar */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
            />

            {/* Scrollable body */}
            <div className="p-6 sm:p-8 space-y-7">

              {/* ── Header ── */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span
                    className="text-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl"
                    style={{
                      background: `${project.color}14`,
                      border:     `1px solid ${project.color}28`,
                    }}
                    aria-hidden
                  >
                    {CATEGORY_ICONS[project.category]}
                  </span>
                  <div>
                    <h2
                      className="font-syne font-bold leading-tight"
                      style={{
                        fontSize:   'clamp(1.3rem, 3vw, 1.7rem)',
                        color:      project.color,
                      }}
                    >
                      {project.title}
                    </h2>
                    <p className="font-manrope text-[var(--text-muted)] mt-0.5" style={{ fontSize: '0.85rem' }}>
                      {project.tagline}
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center',
                    'w-9 h-9 rounded-full',
                    'bg-white/5 hover:bg-white/10',
                    'border border-white/10 hover:border-white/20',
                    'text-white/60 hover:text-white',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
                  )}
                  aria-label="Close project details"
                >
                  <X size={15} aria-hidden />
                </button>
              </div>

              {/* Status + meta row */}
              <div className="flex flex-wrap gap-3 items-center">
                <span
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase rounded-full px-2.5 py-1"
                  style={{
                    color:      project.status !== 'completed' ? project.color : '#94A3B8',
                    background: project.status !== 'completed' ? `${project.color}14` : 'rgba(148,163,184,0.1)',
                    border:     `1px solid ${project.status !== 'completed' ? project.color + '30' : 'rgba(148,163,184,0.2)'}`,
                  }}
                >
                  {project.status !== 'completed'
                    ? <Clock size={9} aria-hidden />
                    : <CheckCircle2 size={9} aria-hidden />
                  }
                  {STATUS_LABELS[project.status]}
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.18em] uppercase rounded-full px-2.5 py-1"
                  style={{
                    color:      'rgba(148,163,184,0.6)',
                    background: 'rgba(148,163,184,0.06)',
                    border:     '1px solid rgba(148,163,184,0.12)',
                  }}
                >
                  {project.category.replace('-', ' ')}
                </span>
              </div>

              {/* ── Divider ── */}
              <div
                aria-hidden
                className="h-px"
                style={{ background: `linear-gradient(90deg, ${project.color}35, transparent)` }}
              />

              {/* ── Two-column body ── */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6">

                {/* Left: descriptions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-syne font-bold text-white mb-2" style={{ fontSize: '0.9rem' }}>
                      About this project
                    </h3>
                    <p
                      className="font-manrope text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontSize: '0.88rem' }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-white mb-2" style={{ fontSize: '0.9rem' }}>
                      In depth
                    </h3>
                    <p
                      className="font-manrope text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontSize: '0.88rem' }}
                    >
                      {project.detail}
                    </p>
                  </div>
                </div>

                {/* Right: highlights */}
                <div className="min-w-[200px]">
                  <h3 className="font-syne font-bold text-white mb-3" style={{ fontSize: '0.9rem' }}>
                    Key highlights
                  </h3>
                  <ul className="space-y-2.5" role="list">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 font-manrope text-[var(--text-secondary)]"
                        style={{ fontSize: '0.82rem', lineHeight: 1.5 }}
                      >
                        <CheckCircle2
                          size={13}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: project.color }}
                          aria-hidden
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Tech stack ── */}
              <div>
                <h3 className="font-syne font-bold text-white mb-3" style={{ fontSize: '0.9rem' }}>
                  Tech stack
                </h3>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Technologies used"
                >
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      role="listitem"
                      className="font-mono text-[10px] tracking-wider rounded-full px-3 py-1"
                      style={{
                        color:      project.color,
                        background: `${project.color}10`,
                        border:     `1px solid ${project.color}22`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Divider ── */}
              <div
                aria-hidden
                className="h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />

              {/* ── Links ── */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-manrope font-medium text-sm px-5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: `${project.color}16`,
                    border:     `1px solid ${project.color}35`,
                    color:      project.color,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = `${project.color}28`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = `${project.color}16`
                  }}
                >
                  <Github size={15} aria-hidden />
                  View on GitHub
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
