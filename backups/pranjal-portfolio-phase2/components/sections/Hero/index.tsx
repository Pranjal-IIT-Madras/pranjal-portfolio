'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import HeroTitle         from './HeroTitle'
import HeroRotatingText  from './HeroRotatingText'
import HeroButtons       from './HeroButtons'
import HeroStats         from './HeroStats'
import { useLenis }      from '@/components/providers/SmoothScrollProvider'

// Particles are pure CSS — no dynamic import needed
const HeroParticles = dynamic(
  () => import('@/components/canvas/HeroParticles'),
  { ssr: false },
)

/**
 * HeroSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-viewport first section.
 *
 * Layout (desktop):
 * ┌─────────────────────────────────────────────────────┐
 * │  LEFT (55%)                RIGHT (45%)              │
 * │  ────────────────────────  ─────────────────────    │
 * │  [label]                   [floating accent card]   │
 * │  PRANJAL                                            │
 * │  BHATNAGAR       ←  ←  ←  gradient line           │
 * │  [rotating text]                                    │
 * │  [buttons]                                          │
 * │  [stats]                                            │
 * └─────────────────────────────────────────────────────┘
 *
 * Mobile: single column, title stacks above everything.
 *
 * Structure:
 *   <section id="hero">               ← scroll target
 *     <div> positioning wrapper
 *       <HeroParticles />             ← CSS floating dots
 *       <div> content grid
 *         <div> left col
 *           <HeroTitle />
 *           <HeroRotatingText />
 *           <HeroButtons />
 *           <HeroStats />
 *         </div>
 *         <div> right col (desktop)
 *           <AccentCard />            ← ambient visual element
 *         </div>
 *       </div>
 *     </div>
 *     <ScrollIndicator />
 *   </section>
 */
export default function HeroSection() {
  const lenis = useLenis()

  function scrollToJourney() {
    if (lenis) {
      lenis.scrollTo('#journey', { offset: -60, duration: 1.4 })
    }
  }

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingBlock: 'clamp(5rem, 10vh, 8rem)' }}
    >
      {/* Particle field */}
      <HeroParticles />

      {/* Subtle radial glow behind title */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 30% 50%,
              rgba(6,182,212,0.07) 0%,
              rgba(59,130,246,0.04) 40%,
              transparent 70%)
          `,
        }}
      />

      {/* ── Main grid ── */}
      <div
        className="relative z-10 max-w-[1280px] mx-auto w-full"
        style={{ padding: 'clamp(1.5rem, 5vw, 6rem)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-8 items-center">

          {/* ──────────────── Left column ──────────────── */}
          <div className="flex flex-col gap-8">

            {/* Category label */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span
                className="h-px flex-shrink-0"
                aria-hidden
                style={{
                  width: '32px',
                  background: 'linear-gradient(90deg, transparent, var(--cyan))',
                }}
              />
              <span className="section-label">Portfolio 2025</span>
              <span
                className="ml-auto text-[10px] font-mono text-[var(--text-muted)] tracking-widest"
                aria-label="Version 1.0"
              >
                v1.0
              </span>
            </motion.div>

            {/* Name — GSAP driven, no Framer wrapper needed */}
            <HeroTitle delay={0.35} />

            {/* Rotating identity text */}
            <HeroRotatingText startDelay={1400} interval={2600} />

            {/* Short bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-manrope text-[var(--text-secondary)] leading-relaxed max-w-[500px]"
              style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1rem)' }}
            >
              Navigating dual academic journeys at{' '}
              <span className="text-[var(--cyan)] font-medium">VIT Bhopal</span> and{' '}
              <span className="text-[var(--blue)] font-medium">IIT Madras</span>{' '}
              — building expertise in software engineering, data science, and algorithms
              while turning academic knowledge into real projects.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <HeroButtons />
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <HeroStats />
            </motion.div>
          </div>

          {/* ──────────────── Right column (desktop only) ──────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center items-center"
            aria-hidden
          >
            <DualJourneyAccent />
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={scrollToJourney}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-sm"
        aria-label="Scroll to journey section"
      >
        <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] group-hover:text-[var(--cyan)] transition-colors uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown
            size={18}
            className="text-[var(--text-muted)] group-hover:text-[var(--cyan)] transition-colors"
          />
        </motion.div>
      </motion.button>
    </section>
  )
}

// ── Ambient right-column visual ────────────────────────────────────────────────
function DualJourneyAccent() {
  return (
    <div className="relative w-[340px] h-[420px]">
      {/* Central orbital rings */}
      {[1, 2, 3].map((r) => (
        <div
          key={r}
          className="absolute inset-0 rounded-full border"
          style={{
            margin:       `${r * 32}px`,
            borderColor:  r === 1
              ? 'rgba(6,182,212,0.18)'
              : r === 2
              ? 'rgba(59,130,246,0.12)'
              : 'rgba(139,92,246,0.08)',
            animation: `spin ${14 + r * 6}s linear infinite ${r % 2 === 0 ? 'reverse' : ''}`,
          }}
        />
      ))}

      {/* Center glow */}
      <div
        className="absolute inset-0 m-auto"
        style={{
          width: '90px',
          height: '90px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.15) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(4px)',
        }}
      />

      {/* Orbiting nodes */}
      <OrbitNode
        label="VIT Bhopal"
        color="var(--cyan)"
        orbitRadius={120}
        speed={20}
        offset={0}
        size={44}
      />
      <OrbitNode
        label="IIT Madras"
        color="var(--blue)"
        orbitRadius={120}
        speed={20}
        offset={Math.PI}
        size={44}
      />
      <OrbitNode
        label="C++"
        color="rgba(56,189,248,0.8)"
        orbitRadius={70}
        speed={14}
        offset={Math.PI / 3}
        size={28}
      />
      <OrbitNode
        label="Python"
        color="rgba(129,140,248,0.8)"
        orbitRadius={70}
        speed={14}
        offset={Math.PI + Math.PI / 3}
        size={28}
      />

      {/* Text: two paths label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ pointerEvents: 'none' }}
      >
        <p className="font-mono text-[9px] tracking-[0.25em] text-[var(--text-muted)] uppercase mb-1">
          Two paths
        </p>
        <p className="font-syne font-bold text-[11px] text-[var(--cyan)]">
          One destination
        </p>
      </div>
    </div>
  )
}

interface OrbitNodeProps {
  label:        string
  color:        string
  orbitRadius:  number
  speed:        number
  offset:       number
  size:         number
}

function OrbitNode({ label, color, orbitRadius, speed, offset, size }: OrbitNodeProps) {
  // CSS animation trick: use a wrapper that rotates, and an inner div that
  // counter-rotates to keep the label upright.
  return (
    <div
      className="absolute"
      style={{
        inset: 0,
        margin: 'auto',
        width:  `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
        animation: `spin ${speed}s linear infinite`,
      }}
    >
      <div
        style={{
          position:  'absolute',
          top:       '0px',
          left:      '50%',
          transform: `translateX(-50%) rotate(${offset}rad)`,
        }}
      >
        {/* Node bubble */}
        <div
          style={{
            width:        `${size}px`,
            height:       `${size}px`,
            borderRadius: '50%',
            background:   `${color}22`,
            border:       `1px solid ${color}60`,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            boxShadow:    `0 0 12px ${color}40`,
            animation:    `spin ${speed}s linear infinite reverse`,
          }}
        >
          <span
            style={{
              fontFamily:   'var(--font-mono)',
              fontSize:     size > 36 ? '8px' : '7px',
              color,
              letterSpacing:'0.06em',
              textAlign:    'center',
              lineHeight:   1.2,
              padding:      '2px',
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}
