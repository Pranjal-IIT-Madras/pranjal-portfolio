'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import LeadershipCard, { type LeadershipItem } from './LeadershipCard'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'

/**
 * LeadershipSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Showcases the Head Boy experience and leadership qualities.
 * NOT a generic "leadership" section — focuses on what the DPS KPV
 * Head Boy role actually required and developed.
 *
 * Layout:
 *  - Full-width story banner at top (Head Boy role highlight)
 *  - 3×2 responsive grid of LeadershipCard components
 *    Each card floats independently with a random phase offset
 *
 * All cards float independently with random phase offsets (see floatY keyframe).
 * This creates a "floating island" feel — premium, organic, alive.
 */

const LEADERSHIP_ITEMS: LeadershipItem[] = [
  {
    icon:        '🏅',
    title:       'Head Boy',
    body:        'Elected to represent the entire student body at DPS KPV Greater Noida — the highest student leadership role in the school.',
    color:       '#E8D5A3',
    metric:      '1',
    metricLabel: 'School leader',
  },
  {
    icon:        '🎤',
    title:       'Public Speaking',
    body:        'Addressed school assemblies, parent meetings, and formal events. Learned that clarity under pressure is a skill, not a personality trait.',
    color:       '#06B6D4',
  },
  {
    icon:        '🤝',
    title:       'Team Coordination',
    body:        'Coordinated between students, faculty, and administration. Built the ability to represent multiple stakeholders without losing credibility with any.',
    color:       '#3B82F6',
  },
  {
    icon:        '📋',
    title:       'Event Management',
    body:        'Organised school-wide events, ceremonies, and inter-house competitions. Learned that logistics and people management are inseparable.',
    color:       '#8B5CF6',
  },
  {
    icon:        '⚖️',
    title:       'Decision Making',
    body:        'Made decisions that affected hundreds of students daily. Developed judgement for when to act decisively and when to consult others first.',
    color:       '#E879F9',
  },
  {
    icon:        '📚',
    title:       'Responsibility',
    body:        'Maintained academic excellence while leading — proving that leadership roles don\'t have to come at the cost of personal standards.',
    color:       '#38BDF8',
  },
]

export default function LeadershipSection() {
  return (
    <section
      id="leadership"
      aria-label="Leadership experience"
      style={{ padding: 'var(--section-py) var(--section-px)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <SectionHeader
          index="05"
          label="Leadership"
          title="Head Boy & Beyond"
          description="Student leadership taught lessons that no classroom could — on responsibility, decision-making, and what it means to represent others."
          className="mb-12"
        />

        {/* ── Story banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden mb-12 p-6 md:p-8"
          style={{
            background:  'linear-gradient(135deg, rgba(232,213,163,0.06) 0%, rgba(6,182,212,0.04) 100%)',
            border:      '1px solid rgba(232,213,163,0.15)',
          }}
          role="banner"
          aria-label="Head Boy highlight"
        >
          {/* Background decoration */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{
              background:  'radial-gradient(circle, rgba(232,213,163,0.08) 0%, transparent 70%)',
              transform:   'translate(20%, -20%)',
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Emblem */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background:   'rgba(232,213,163,0.1)',
                border:       '1px solid rgba(232,213,163,0.25)',
                boxShadow:    '0 0 24px rgba(232,213,163,0.12)',
              }}
              aria-hidden
            >
              🏅
            </div>

            <div>
              <p
                className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1"
                style={{ color: 'rgba(232,213,163,0.7)' }}
              >
                Student Leadership · DPS KPV Greater Noida
              </p>
              <h3
                className="font-syne font-bold mb-2"
                style={{
                  fontSize:   'clamp(1.2rem, 2.5vw, 1.5rem)',
                  color:      '#E8D5A3',
                }}
              >
                Head Boy
              </h3>
              <p
                className="font-manrope text-[var(--text-secondary)] leading-relaxed max-w-2xl"
                style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}
              >
                Serving as Head Boy meant being the voice of the student body, the liaison with
                administration, and the face of the school at formal events — simultaneously.
                It demanded judgment, composure, and the ability to earn trust from people with
                very different perspectives.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Leadership cards grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
          aria-label="Leadership qualities"
        >
          {LEADERSHIP_ITEMS.map((item, i) => (
            <motion.div key={item.title} variants={itemVariants} role="listitem">
              <LeadershipCard
                item={item}
                delay={i * 0.05}
                floatDir={i % 2 === 0 ? 'up' : 'down'}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
