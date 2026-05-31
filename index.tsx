'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import AboutCard from './AboutCard'
import { PERSONAL } from '@/constants/personal'
import {
  staggerContainer,
  itemVariants,
  fadeInLeft,
  fadeInRight,
} from '@/lib/animations/framer-variants'
import { useInView } from '@/hooks/useInView'

/**
 * AboutSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Personal introduction section. NOT a generic bio.
 *
 * Desktop layout (two-column):
 * ┌─────────────────────┬──────────────────────┐
 * │  Storytelling text  │  Three highlight cards│
 * │  (60%)              │  (40%)               │
 * └─────────────────────┴──────────────────────┘
 *
 * Bottom strip: identity tags row.
 *
 * Content focus:
 *  - The unusual decision to pursue TWO degrees simultaneously
 *  - Head Boy leadership background
 *  - Current learning mindset
 *  - Identity as a student/developer/problem solver (NOT entrepreneur)
 */

const IDENTITY_PILLARS = [
  { label: 'Computer Science Student', color: '#06B6D4' },
  { label: 'Problem Solver',          color: '#3B82F6' },
  { label: 'Technology Enthusiast',   color: '#8B5CF6' },
  { label: 'Developer',               color: '#06B6D4' },
  { label: 'Lifelong Learner',        color: '#3B82F6' },
] as const

const HIGHLIGHT_CARDS = [
  {
    icon:    '🎓',
    heading: 'Dual Enrollment',
    body:    'B.Tech CSE at VIT Bhopal and BS Data Science at IIT Madras — both running simultaneously since 2023. Two disciplines, one perspective.',
    color:   '#06B6D4',
    badge:   '2023 — Present',
    delay:   0.1,
  },
  {
    icon:    '🏅',
    heading: 'Head Boy',
    body:    'Led a school of hundreds as Head Boy at DPS KPV. Public speaking, event coordination, and the weight of representing a community.',
    color:   '#E8D5A3',
    badge:   'DPS KPV Greater Noida',
    delay:   0.18,
  },
  {
    icon:    '⚡',
    heading: 'Builder Mindset',
    body:    'Currently writing C++ daily, solving algorithmic problems, and building projects that connect both academic worlds into real software.',
    color:   '#8B5CF6',
    badge:   'Active Projects',
    delay:   0.26,
  },
] as const

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef as React.RefObject<Element>, { threshold: 0.1 })

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Pranjal Bhatnagar"
      style={{ padding: 'var(--section-py) var(--section-px)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* ── Section header ── */}
        <SectionHeader
          index="01"
          label="About"
          title="The Student Behind the Code"
          description="Two degree programs. One mission."
          className="mb-14"
        />

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">

          {/* ──────── LEFT: Storytelling text ──────── */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-6"
          >
            {/* Opening statement */}
            <p
              className="font-syne font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}
            >
              Most students pick one path.{' '}
              <span className="text-gradient-cyan">I chose two.</span>
            </p>

            {/* Story paragraphs */}
            <div
              className="font-manrope text-[var(--text-secondary)] space-y-4 leading-relaxed"
              style={{ fontSize: 'clamp(0.92rem, 1.6vw, 1rem)' }}
            >
              <p>
                Currently pursuing{' '}
                <span className="text-[#06B6D4] font-medium">
                  B.Tech Computer Science Engineering at VIT Bhopal
                </span>{' '}
                and{' '}
                <span className="text-[#3B82F6] font-medium">
                  BS Data Science & Applications at IIT Madras
                </span>{' '}
                simultaneously — not because I had to, but because neither alone was enough.
              </p>

              <p>
                Computer science gives me the tools to build. Data science gives me the lens
                to understand. Together, they form a perspective that's genuinely hard to
                develop from a single discipline.
              </p>

              <p>
                Before university, I served as{' '}
                <span className="text-[#E8D5A3] font-medium">Head Boy at DPS KPV</span> —
                which taught me something more enduring than any technical skill: how to
                take responsibility for others and make decisions that actually matter.
              </p>

              <p>
                I&apos;m still early in this journey. Right now I&apos;m focused on building
                real depth: C++ fundamentals, algorithms, web development, and the mathematics
                behind machine learning. The goal isn&apos;t to know everything — it&apos;s to
                understand what I know well enough to build something with it.
              </p>
            </div>

            {/* Currently section */}
            <div
              className="rounded-2xl p-5"
              style={{
                background:  'rgba(6, 182, 212, 0.04)',
                border:      '1px solid rgba(6, 182, 212, 0.12)',
              }}
            >
              <p className="font-mono text-[10px] text-[var(--cyan)] tracking-[0.2em] uppercase mb-3">
                Currently
              </p>
              <ul className="space-y-2" role="list">
                {[
                  'Writing C++ daily — from OOP to competitive programming',
                  'Studying Data Structures & Algorithms systematically',
                  'Exploring web development with Next.js and TypeScript',
                  'Applying Python to real data science problems',
                  'Contributing to GitHub projects, learning in public',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-manrope text-[var(--text-secondary)]"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <span
                      className="flex-shrink-0 w-1 h-1 rounded-full bg-[var(--cyan)] mt-2"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ──────── RIGHT: Highlight cards ──────── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-4"
          >
            {HIGHLIGHT_CARDS.map((card) => (
              <AboutCard
                key={card.heading}
                icon={card.icon}
                heading={card.heading}
                body={card.body}
                color={card.color}
                badge={card.badge}
                delay={card.delay}
              />
            ))}

            {/* Quick-fact grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              {[
                { value: '2', label: 'Universities', color: '#06B6D4' },
                { value: '6+', label: 'Certifications', color: '#3B82F6' },
                { value: '5+', label: 'GitHub Projects', color: '#8B5CF6' },
                { value: '∞', label: 'Learning', color: '#E879F9' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="rounded-xl p-3 text-center"
                  style={{
                    background:  `${stat.color}08`,
                    border:      `1px solid ${stat.color}20`,
                  }}
                >
                  <div
                    className="font-syne font-bold"
                    style={{
                      fontSize: '1.5rem',
                      color:    stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-mono uppercase tracking-wider text-[var(--text-muted)] mt-1"
                    style={{ fontSize: '9px', letterSpacing: '0.12em' }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Identity pillars ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 flex flex-wrap justify-center gap-3"
          role="list"
          aria-label="Identity pillars"
        >
          {IDENTITY_PILLARS.map((pillar, i) => (
            <motion.span
              key={pillar.label}
              variants={itemVariants}
              role="listitem"
              className="font-manrope font-medium rounded-full px-5 py-2"
              style={{
                fontSize:   'clamp(0.8rem, 1.5vw, 0.9rem)',
                color:      pillar.color,
                background: `${pillar.color}0D`,
                border:     `1px solid ${pillar.color}25`,
              }}
            >
              {pillar.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
