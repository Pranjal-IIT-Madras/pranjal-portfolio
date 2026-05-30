'use client'

import dynamic from 'next/dynamic'
import {
  useRef,
  useEffect,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import { gsap } from '@/lib/animations/gsap-plugins'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '@/components/ui/SectionHeader'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

// Dynamically import the R3F constellation — requires browser APIs
const JourneyConstellation = dynamic(
  () => import('./JourneyConstellation'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: '100vh' }}
        aria-label="Loading constellation..."
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-[var(--cyan)] border-t-transparent animate-spin"
            aria-hidden
          />
          <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">
            LOADING CONSTELLATION
          </p>
        </div>
      </div>
    ),
  },
)

/**
 * JourneySection
 * ─────────────────────────────────────────────────────────────────────────────
 * THE SIGNATURE FEATURE of the portfolio.
 *
 * Architecture:
 *  - The section is 250vh tall (extra height for scroll-driven storytelling).
 *  - A sticky inner container keeps the constellation canvas fixed in view.
 *  - GSAP ScrollTrigger scrubs a scrollProgress ref (0→1) that the
 *    ConstellationScene reads in its CameraController useFrame loop.
 *  - The sidebar/legend panels fade in at specific scroll milestones.
 *
 * Scroll journey:
 *  0%    — Camera above DPS KPV (start node) — viewer sees origin
 *  18%   — Camera tilts left → VIT Bhopal cluster comes into focus
 *  35%   — Camera tilts right → IIT Madras cluster comes into focus
 *  55%   — Wide view of both branches + crossing paths
 *  75%   — Camera descends → Current Focus node enters frame
 *  100%  — Settled on Current Focus + sub-nodes
 *
 * The sidebar story panels overlay the canvas with glassmorphic cards,
 * revealing information contextually as the user scrolls.
 *
 * Performance:
 *  - ScrollTrigger uses `scrub: 0.4` for smooth lag-smoothed movement.
 *  - The scrollProgress ref is updated in ScrollTrigger's onUpdate;
 *    the R3F useFrame reads from the ref — no React state updates in the loop.
 *  - Sidebar panel animations use Framer Motion with IntersectionObserver
 *    so they only re-render when crossing the viewport boundary.
 */

// ── Sidebar story cards ────────────────────────────────────────────────────────

interface StoryCard {
  id:          string
  scrollRange: [number, number] // when to show (0-1 progress)
  label:       string
  heading:     string
  body:        string
  color:       string
  side:        'left' | 'right'
}

const STORY_CARDS: StoryCard[] = [
  {
    id:          'dps',
    scrollRange: [0, 0.22],
    label:       'Origin',
    heading:     'DPS KPV, Greater Noida',
    body:        'Where it began. Senior secondary education, Head Boy, early Python — and the realisation that technology was the path.',
    color:       '#E8D5A3',
    side:        'left',
  },
  {
    id:          'vit',
    scrollRange: [0.15, 0.55],
    label:       'Left path',
    heading:     'VIT Bhopal',
    body:        'B.Tech Computer Science Engineering. Deep dives into C++, OOP, data structures, algorithms, and software development — building the engineering mindset.',
    color:       '#06B6D4',
    side:        'left',
  },
  {
    id:          'iit',
    scrollRange: [0.28, 0.65],
    label:       'Right path',
    heading:     'IIT Madras',
    body:        'BS Data Science & Applications. Statistics, probability, machine learning foundations, and Python applications — building the analytical mindset.',
    color:       '#3B82F6',
    side:        'right',
  },
  {
    id:          'focus',
    scrollRange: [0.68, 1.0],
    label:       'Convergence',
    heading:     'Current Focus',
    body:        'Both paths merge. Web development, advanced C++, DSA, data science, and open-source learning — pursuing depth across the full spectrum.',
    color:       '#8B5CF6',
    side:        'right',
  },
]

// ── Path legend ────────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { color: '#06B6D4', label: 'VIT Bhopal path',    dot: true  },
  { color: '#3B82F6', label: 'IIT Madras path',    dot: true  },
  { color: '#8B5CF6', label: 'Converging paths',   dot: true  },
  { color: '#E879F9', label: 'Current focus',       dot: true  },
]

export default function JourneySection() {
  const sectionRef      = useRef<HTMLElement>(null)
  const stickyRef       = useRef<HTMLDivElement>(null)
  // This ref is read by the R3F useFrame — never triggers re-renders
  const scrollProgressRef = useRef<number>(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const isMobile = useIsMobile()

  // ── GSAP ScrollTrigger ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return

    const trigger = ScrollTrigger.create({
      trigger:  sectionRef.current,
      start:    'top top',
      end:      'bottom bottom',
      scrub:    0.4,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
        // Only update state (which re-renders sidebar) at coarse intervals
        setScrollProgress(Math.round(self.progress * 20) / 20)
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-label="Academic journey constellation"
      style={{ height: isMobile ? '200vh' : '250vh' }}
    >
      {/* ── Sticky wrapper: pins canvas during scroll travel ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* ── Section header (top strip) ── */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,8,22,0.95) 0%, transparent 100%)',
            paddingBottom: '3rem',
          }}
        >
          <div
            className="max-w-[1280px] mx-auto"
            style={{ padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 5vw, 6rem) 0' }}
          >
            <SectionHeader
              index="02"
              label="Journey"
              title="The Constellation"
              description="Two academic paths departing from a single origin, growing through different disciplines, converging into a unified technical identity."
            />
          </div>
        </div>

        {/* ── Constellation canvas (fills the sticky container) ── */}
        <JourneyConstellation scrollProgressRef={scrollProgressRef} />

        {/* ── Sidebar story panels ── */}
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            aria-hidden="true"
          >
            {STORY_CARDS.map((card) => {
              const [low, high] = card.scrollRange
              const visible = scrollProgress >= low && scrollProgress <= high

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: card.side === 'left' ? -20 : 20 }}
                  animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: card.side === 'left' ? -20 : 20 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-[240px]',
                    card.side === 'left'  ? 'left-6 xl:left-12' : 'right-6 xl:right-12',
                  )}
                >
                  <div
                    className="glass rounded-2xl p-5"
                    style={{
                      borderColor: `${card.color}20`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${card.color}10`,
                    }}
                  >
                    {/* Label */}
                    <span
                      className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2 block"
                      style={{ color: card.color }}
                    >
                      {card.label}
                    </span>

                    {/* Heading */}
                    <h3
                      className="font-syne font-bold mb-2 leading-tight"
                      style={{
                        fontSize: '15px',
                        color:    card.color,
                      }}
                    >
                      {card.heading}
                    </h3>

                    {/* Body */}
                    <p
                      className="font-manrope text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontSize: '12px' }}
                    >
                      {card.body}
                    </p>

                    {/* Accent dot indicator */}
                    <div
                      className="mt-3 flex items-center gap-1.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: card.color,
                          boxShadow:  `0 0 6px ${card.color}`,
                        }}
                        aria-hidden
                      />
                      <span
                        className="font-mono text-[9px] tracking-wider"
                        style={{ color: `${card.color}90` }}
                      >
                        {Math.round(scrollProgress * 100)}% explored
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* ── Bottom gradient fade ── */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height:     '12rem',
            background: 'linear-gradient(to top, rgba(5,8,22,0.9) 0%, transparent 100%)',
          }}
        />

        {/* ── Legend ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div
            className="glass rounded-full px-5 py-2.5 flex items-center gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: item.color, boxShadow: `0 0 5px ${item.color}` }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[9px] tracking-wider text-[var(--text-muted)] hidden sm:block"
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Scroll progress indicator (right edge) ── */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
          aria-hidden
        >
          <div
            className="w-0.5 rounded-full overflow-hidden"
            style={{
              height:     '120px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="w-full rounded-full"
              style={{
                height:          `${scrollProgress * 100}%`,
                background:      'linear-gradient(to bottom, var(--cyan), var(--blue), var(--purple))',
                transition:      'height 0.1s linear',
              }}
            />
          </div>
          <span
            className="font-mono text-[8px] tracking-widest text-[var(--text-muted)]"
            style={{ writingMode: 'vertical-rl' }}
          >
            JOURNEY
          </span>
        </div>
      </div>
    </section>
  )
}
