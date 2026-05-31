'use client'

import { useRef, useCallback, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react'
import type { EducationItem } from '@/constants/education'
import { cn } from '@/lib/utils/cn'
import { cardReveal } from '@/lib/animations/framer-variants'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { useCursor } from '@/components/cursor/CursorContext'

interface EducationCardProps {
  item:       EducationItem
  delay?:     number
  className?: string
  /** Side this card appears on in the timeline */
  side?:      'left' | 'right' | 'center'
}

/**
 * EducationCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium institution card used in the Education timeline section.
 *
 * Visual anatomy:
 * ┌────────────────────────────────────┐
 * │ [Status badge]     [Duration]      │
 * │                                    │
 * │ Institution Name  (large, colored) │
 * │ Degree · Field                     │
 * │ Location                           │
 * │                                    │
 * │ ─────────────────────────────────  │
 * │ Description paragraph              │
 * │                                    │
 * │ [Skill chip] [Skill chip] ...      │
 * └────────────────────────────────────┘
 *
 * Hover: 3D tilt via GSAP, glow intensifies.
 * "Ongoing" badge pulses.
 */
export default function EducationCard({
  item,
  delay     = 0,
  className,
  side      = 'center',
}: EducationCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const hasFine    = useHasFinePointer()
  const { enterCard, leaveAll } = useCursor()

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!hasFine || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) / (rect.width  / 2)
    const dy   = (e.clientY - cy) / (rect.height / 2)

    gsap.to(cardRef.current, {
      rotationY:          dx * 6,
      rotationX:          -dy * 6,
      duration:           0.35,
      ease:               'power2.out',
      transformPerspective: 1000,
    })
  }, [hasFine])

  const handleMouseLeave = useCallback(() => {
    leaveAll()
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [leaveAll])

  const isOngoing = item.status === 'ongoing'

  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      whileHover={{ y: -6 }}
      className={cn('h-full', className)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={enterCard}
        onMouseLeave={handleMouseLeave}
        className="relative h-full rounded-2xl overflow-hidden"
        style={{
          background:     'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border:         `1px solid ${item.color}20`,
          boxShadow:      `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)`,
          transition:     'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Top glow edge */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
          }}
        />

        {/* Ambient corner glow */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-full"
          style={{
            background:  `radial-gradient(circle, ${item.color}18 0%, transparent 70%)`,
            transform:   'translate(30%, -30%)',
          }}
        />

        {/* Card body */}
        <div className="relative z-10 p-6 flex flex-col gap-4 h-full">

          {/* ── Header row ── */}
          <div className="flex items-start justify-between gap-3">
            {/* Status badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase rounded-full px-2.5 py-1',
                isOngoing && 'animate-pulse',
              )}
              style={{
                color:      isOngoing ? item.color : '#94A3B8',
                background: isOngoing ? `${item.color}14` : 'rgba(148,163,184,0.1)',
                border:     `1px solid ${isOngoing ? item.color + '30' : 'rgba(148,163,184,0.2)'}`,
              }}
            >
              {isOngoing
                ? <Clock size={9} aria-hidden />
                : <CheckCircle2 size={9} aria-hidden />
              }
              {isOngoing ? 'Ongoing' : 'Completed'}
            </span>

            {/* Duration */}
            <span
              className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] flex-shrink-0"
            >
              <Calendar size={10} aria-hidden />
              {item.duration}
            </span>
          </div>

          {/* ── Institution name ── */}
          <div>
            <h3
              className="font-syne font-bold leading-tight mb-1"
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
                color:    item.color,
                textShadow: `0 0 20px ${item.glowColor}40`,
              }}
            >
              {item.institution}
            </h3>
            <p
              className="font-manrope font-medium text-white/80"
              style={{ fontSize: 'clamp(0.82rem, 1.4vw, 0.9rem)' }}
            >
              {item.degree}
            </p>
            <p
              className="flex items-center gap-1.5 font-manrope text-[var(--text-muted)] mt-1"
              style={{ fontSize: '0.8rem' }}
            >
              <MapPin size={11} aria-hidden />
              {item.location}
            </p>
          </div>

          {/* ── Divider ── */}
          <div
            aria-hidden
            className="h-px"
            style={{
              background: `linear-gradient(90deg, ${item.color}40, transparent)`,
            }}
          />

          {/* ── Description ── */}
          <p
            className="font-manrope text-[var(--text-secondary)] leading-relaxed flex-1"
            style={{ fontSize: 'clamp(0.82rem, 1.4vw, 0.88rem)' }}
          >
            {item.description}
          </p>

          {/* ── Highlights chips ── */}
          <div
            className="flex flex-wrap gap-1.5"
            role="list"
            aria-label={`${item.institution} skills and highlights`}
          >
            {item.highlights.map((highlight) => (
              <span
                key={highlight}
                role="listitem"
                className="font-mono text-[9px] tracking-wider rounded-full px-2.5 py-1"
                style={{
                  color:      item.color,
                  background: `${item.color}10`,
                  border:     `1px solid ${item.color}20`,
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
