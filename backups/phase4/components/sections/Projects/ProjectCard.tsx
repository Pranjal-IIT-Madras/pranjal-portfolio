'use client'

import { useRef, useCallback, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import type { Project } from '@/constants/projects'
import { cn } from '@/lib/utils/cn'
import { cardReveal } from '@/lib/animations/framer-variants'
import { useCursor } from '@/components/cursor/CursorContext'
import { useHasFinePointer } from '@/hooks/useMediaQuery'

const STATUS_LABELS: Record<Project['status'], string> = {
  completed: 'Completed',
  ongoing:   'Ongoing',
  learning:  'In Progress',
}

const CATEGORY_ICONS: Record<Project['category'], string> = {
  'data-science': '📊',
  'software':     '⚙️',
  'education':    '📚',
  'practice':     '🔧',
}

interface ProjectCardProps {
  project:   Project
  delay?:    number
  onOpen:    (project: Project) => void
  /** Renders at full width for featured projects */
  featured?: boolean
}

/**
 * ProjectCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Case-study style card for one project.
 *
 * Visual anatomy:
 * ┌─────────────────────────────────────┐
 * │ [Category icon]  [Status badge]     │
 * │                                     │
 * │ Project title (Syne bold, colored)  │
 * │ Tagline (Manrope, muted)            │
 * │                                     │
 * │ Description (2-line clamp)          │
 * │                                     │
 * │ ─────────────────────────────────── │
 * │ [Stack chip] [Stack chip] ...       │
 * │                   [GitHub] [→ Case] │
 * └─────────────────────────────────────┘
 *
 * Hover: GSAP tilt + animated glow border intensifies.
 * Click anywhere on card → opens ProjectModal.
 * GitHub link → opens repo (stopPropagation so modal doesn't also open).
 */
export default function ProjectCard({
  project,
  delay    = 0,
  onOpen,
  featured = false,
}: ProjectCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const hasFine    = useHasFinePointer()
  const { enterCard, leaveAll } = useCursor()

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!hasFine || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    gsap.to(cardRef.current, {
      rotationY: dx * 5, rotationX: -dy * 5,
      duration: 0.35, ease: 'power2.out',
      transformPerspective: 1000,
    })
  }, [hasFine])

  const handleMouseLeave = useCallback(() => {
    leaveAll()
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0,
      duration: 0.55, ease: 'elastic.out(1, 0.5)',
    })
  }, [leaveAll])

  const isOngoing = project.status !== 'completed'

  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ y: -7 }}
      className={cn('h-full', featured && 'md:col-span-2')}
    >
      <div
        ref={cardRef}
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background:      'rgba(15,23,42,0.60)',
          backdropFilter:  'blur(20px)',
          border:          `1px solid ${project.color}1A`,
          transition:      'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          enterCard()
          if (cardRef.current) {
            cardRef.current.style.borderColor = `${project.color}45`
            cardRef.current.style.boxShadow   = `0 16px 48px rgba(0,0,0,0.5), 0 0 32px ${project.color}14`
          }
        }}
        onMouseLeave={() => {
          handleMouseLeave()
          if (cardRef.current) {
            cardRef.current.style.borderColor = `${project.color}1A`
            cardRef.current.style.boxShadow   = 'none'
          }
        }}
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title} project details`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(project) }}
      >
        {/* Top edge glow */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}55, transparent)` }}
        />

        {/* Corner glow */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${project.color}12 0%, transparent 70%)`,
            transform:  'translate(30%, -30%)',
          }}
        />

        <div className={cn(
          'relative z-10 flex flex-col h-full',
          featured ? 'p-7 gap-5' : 'p-5 gap-4',
        )}>

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Category icon */}
              <span
                className="text-lg flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: `${project.color}12`,
                  border:     `1px solid ${project.color}25`,
                }}
                aria-hidden
              >
                {CATEGORY_ICONS[project.category]}
              </span>
            </div>

            {/* Status badge */}
            <span
              className="flex-shrink-0 font-mono text-[9px] tracking-[0.18em] uppercase rounded-full px-2.5 py-1"
              style={{
                color:      isOngoing ? project.color : 'rgba(148,163,184,0.7)',
                background: isOngoing ? `${project.color}14` : 'rgba(148,163,184,0.08)',
                border:     `1px solid ${isOngoing ? project.color + '30' : 'rgba(148,163,184,0.15)'}`,
              }}
            >
              {STATUS_LABELS[project.status]}
            </span>
          </div>

          {/* ── Title & tagline ── */}
          <div>
            <h3
              className="font-syne font-bold leading-tight mb-1 group-hover:opacity-100 transition-opacity"
              style={{
                fontSize:   featured ? 'clamp(1.2rem, 2.4vw, 1.5rem)' : 'clamp(1.05rem, 2vw, 1.2rem)',
                color:      project.color,
                textShadow: `0 0 20px ${project.color}30`,
              }}
            >
              {project.title}
            </h3>
            <p
              className="font-manrope font-medium"
              style={{ fontSize: '0.82rem', color: 'rgba(148,163,184,0.75)' }}
            >
              {project.tagline}
            </p>
          </div>

          {/* ── Description ── */}
          <p
            className="font-manrope text-[var(--text-secondary)] leading-relaxed flex-1"
            style={{
              fontSize:        'clamp(0.82rem, 1.4vw, 0.88rem)',
              display:         '-webkit-box',
              WebkitLineClamp: featured ? 4 : 3,
              WebkitBoxOrient: 'vertical',
              overflow:        'hidden',
            }}
          >
            {project.description}
          </p>

          {/* ── Divider ── */}
          <div
            aria-hidden
            className="h-px"
            style={{ background: `linear-gradient(90deg, ${project.color}30, transparent)` }}
          />

          {/* ── Stack + links row ── */}
          <div className="flex items-end justify-between gap-3">
            {/* Stack chips */}
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0" role="list" aria-label="Tech stack">
              {project.stack.slice(0, featured ? 5 : 3).map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="font-mono text-[9px] tracking-wider rounded-full px-2 py-0.5"
                  style={{
                    color:      project.color,
                    background: `${project.color}0E`,
                    border:     `1px solid ${project.color}20`,
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > (featured ? 5 : 3) && (
                <span
                  className="font-mono text-[9px] rounded-full px-2 py-0.5"
                  style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
                  aria-label={`${project.stack.length - (featured ? 5 : 3)} more technologies`}
                >
                  +{project.stack.length - (featured ? 5 : 3)}
                </span>
              )}
            </div>

            {/* Action links */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* GitHub link */}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                style={{
                  color:      'var(--text-muted)',
                  background: 'rgba(255,255,255,0.05)',
                  border:     '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation()
                  ;(e.currentTarget as HTMLElement).style.color       = project.color
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${project.color}40`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color       = 'var(--text-muted)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                }}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github size={14} aria-hidden />
              </a>

              {/* Case study CTA */}
              <button
                className="flex items-center gap-1 font-mono text-[9px] tracking-wider rounded-lg px-2.5 py-1.5 transition-all"
                style={{
                  color:      project.color,
                  background: `${project.color}10`,
                  border:     `1px solid ${project.color}25`,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = `${project.color}20`
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${project.color}50`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = `${project.color}10`
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${project.color}25`
                }}
                onClick={(e) => { e.stopPropagation(); onOpen(project) }}
                aria-label={`Read ${project.title} case study`}
              >
                Details
                <ArrowUpRight size={10} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
