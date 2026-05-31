'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import EducationCard from './EducationCard'
import { EDUCATION_ITEMS } from '@/constants/education'
import { staggerContainer, itemVariants, fadeInUp } from '@/lib/animations/framer-variants'

/**
 * EducationSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Visual structure:
 *
 *         ┌──────────────────────────┐
 *         │     DPS KPV (origin)     │
 *         └────────────┬─────────────┘
 *                      │
 *          ┌───────────┴───────────┐
 *          │     FORK connector    │
 *          ▼                       ▼
 *  ┌──────────────┐       ┌──────────────┐
 *  │  VIT Bhopal  │       │  IIT Madras  │
 *  │  (ongoing)   │◄─────►│  (ongoing)   │
 *  └──────────────┘       └──────────────┘
 *          └───────────┬───────────┘
 *                      │
 *               [Merge badge]
 *
 * The SVG connector is drawn with a CSS stroke-dashoffset animation
 * triggered when the element enters the viewport.
 *
 * Mobile: vertical stack, DPS → VIT → IIT with a simple vertical line.
 */

const dps   = EDUCATION_ITEMS.find((e) => e.id === 'dps-kvp')!
const vit   = EDUCATION_ITEMS.find((e) => e.id === 'vit-bhopal')!
const iit   = EDUCATION_ITEMS.find((e) => e.id === 'iit-madras')!

// SVG path circumference for the fork line
const FORK_PATH_LENGTH = 300

export default function EducationSection() {
  const forkRef = useRef<SVGPathElement>(null)

  return (
    <section
      id="education"
      aria-label="Education history"
      style={{ padding: 'var(--section-py) var(--section-px)' }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <SectionHeader
          index="03"
          label="Education"
          title="Academic Foundations"
          description="Three institutions. Two simultaneous degrees. One coherent technical identity being built across every campus."
          className="mb-16"
        />

        {/* ── ORIGIN — DPS KPV ────────────────────────────────────────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-[660px] mx-auto mb-0"
        >
          <EducationCard item={dps} delay={0} side="center" />
        </motion.div>

        {/* ── FORK CONNECTOR — desktop SVG ── */}
        <div
          className="relative hidden md:flex justify-center"
          style={{ height: '80px' }}
          aria-hidden
        >
          {/* Central stem down */}
          <svg
            width="640"
            height="80"
            viewBox="0 0 640 80"
            fill="none"
            className="absolute top-0"
          >
            {/* Stem from DPS down */}
            <motion.line
              x1="320" y1="0"
              x2="320" y2="32"
              stroke="rgba(232,213,163,0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            {/* Horizontal fork bar */}
            <motion.line
              x1="140" y1="32"
              x2="500" y2="32"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              style={{ transformOrigin: '320px 32px' }}
              transition={{ duration: 0.55, delay: 0.45 }}
            />
            {/* Left arm to VIT */}
            <motion.line
              x1="140" y1="32"
              x2="140" y2="80"
              stroke="rgba(6,182,212,0.5)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
            />
            {/* Right arm to IIT */}
            <motion.line
              x1="500" y1="32"
              x2="500" y2="80"
              stroke="rgba(59,130,246,0.5)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
            />
            {/* Dot at fork point */}
            <motion.circle
              cx="320" cy="32" r="3"
              fill="rgba(255,255,255,0.3)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: 0.5, type: 'spring' }}
            />
          </svg>
        </div>

        {/* ── Mobile connector ── */}
        <div
          className="flex md:hidden justify-center py-3"
          aria-hidden
        >
          <div
            className="w-px"
            style={{
              height:     '40px',
              background: 'linear-gradient(to bottom, rgba(232,213,163,0.5), rgba(6,182,212,0.3))',
            }}
          />
        </div>

        {/* ── PARALLEL — VIT + IIT ─────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 relative"
        >
          {/* Horizontal bridge between the two ongoing cards */}
          <div
            className="absolute top-[28px] left-[calc(50%-48px)] hidden md:flex items-center justify-center"
            style={{ width: '96px', zIndex: 10 }}
            aria-hidden
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.5 }}
              className="w-full h-px"
              style={{
                background: 'linear-gradient(90deg, rgba(6,182,212,0.5), rgba(59,130,246,0.5))',
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* Simultaneous badge */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="absolute top-[16px] left-1/2 -translate-x-1/2 z-20 hidden md:flex"
          >
            <span
              className="font-mono text-[8px] tracking-[0.18em] uppercase rounded-full px-3 py-1 whitespace-nowrap"
              style={{
                background: 'rgba(5,8,22,0.95)',
                border:     '1px solid rgba(255,255,255,0.1)',
                color:      'rgba(255,255,255,0.4)',
              }}
            >
              Simultaneous
            </span>
          </motion.div>

          {/* VIT card */}
          <motion.div variants={itemVariants}>
            <EducationCard item={vit} side="left" />
          </motion.div>

          {/* IIT card */}
          <motion.div variants={itemVariants}>
            <EducationCard item={iit} side="right" />
          </motion.div>
        </motion.div>

        {/* ── MERGE — convergence indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <div
            className="text-center max-w-md"
            role="complementary"
            aria-label="Convergence note"
          >
            {/* Merge lines */}
            <div
              className="hidden md:flex justify-center mb-4"
              aria-hidden
            >
              <svg width="300" height="40" viewBox="0 0 300 40" fill="none">
                <motion.line
                  x1="60" y1="0" x2="150" y2="40"
                  stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                <motion.line
                  x1="240" y1="0" x2="150" y2="40"
                  stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                <motion.circle
                  cx="150" cy="40" r="3"
                  fill="rgba(139,92,246,0.6)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.55, type: 'spring' }}
                />
              </svg>
            </div>

            <p
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2"
            >
              Currently converging toward
            </p>
            <p
              className="font-syne font-bold"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Full-stack software engineering + data intelligence
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
