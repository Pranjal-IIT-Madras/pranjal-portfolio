'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
}

const MESSAGES = [
  'Initializing Portfolio...',
  'Loading Journey...',
  'Connecting Constellations...',
  'Rendering Projects...',
  'Preparing Experience...',
]

const NAME_CHARS = 'PRANJAL BHATNAGAR'.split('')

/**
 * LoadingScreen
 * ─────────────────────────────────────────────────────────────────────────────
 * Cinematic entry experience using a GSAP timeline:
 *  0.3s  — Characters of "PRANJAL BHATNAGAR" slide up one by one
 *  1.0s  — Subtitle fades in
 *  1.2s  — Loading messages start cycling (one per 0.55s)
 *  4.2s  — Progress bar fills to 100%
 *  4.4s  — "Launch Complete" flashes
 *  4.8s  — Entire overlay fades out
 *  5.0s  — onComplete() called, loader unmounts
 *
 * Reduced motion: skips character animation, runs at 3× speed.
 */
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const charsRef     = useRef<HTMLSpanElement[]>([])
  const subtitleRef  = useRef<HTMLParagraphElement>(null)
  const messageRef   = useRef<HTMLParagraphElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const progressPctRef = useRef<HTMLSpanElement>(null)
  const doneRef      = useRef<HTMLDivElement>(null)
  const tlRef        = useRef<gsap.core.Timeline | null>(null)
  const [, forceRender] = useState(0) // trigger one render after mount for refs

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speed = prefersReduced ? 3 : 1

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        onComplete()
      },
    })
    tlRef.current = tl

    // Ensure starting state
    gsap.set(wrapperRef.current, { opacity: 1 })
    gsap.set(charsRef.current, { yPercent: 110, opacity: 0 })
    gsap.set([subtitleRef.current, messageRef.current, doneRef.current], { opacity: 0 })
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left' })

    // 1. Name character reveal
    if (!prefersReduced) {
      tl.to(charsRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.55 / speed,
        stagger: 0.028 / speed,
        delay: 0.35 / speed,
      })
    } else {
      tl.to(charsRef.current, { yPercent: 0, opacity: 1, duration: 0.2, stagger: 0 })
    }

    // 2. Subtitle
    tl.to(subtitleRef.current, { opacity: 1, duration: 0.5 / speed }, '-=0.1')

    // 3. Cycle loading messages
    MESSAGES.forEach((msg, i) => {
      tl.call(
        () => {
          if (messageRef.current) messageRef.current.textContent = msg
        },
        [],
        i === 0 ? `+=0.1` : `+=0.5`,
      )
      tl.to(messageRef.current, { opacity: 1, duration: 0.3 / speed })
      if (i < MESSAGES.length - 1) {
        tl.to(messageRef.current, { opacity: 0.3, duration: 0.25 / speed }, '+=0.2')
      }
    })

    // 4. Progress bar (runs in parallel with messages)
    tl.to(
      progressRef.current,
      { scaleX: 1, duration: (MESSAGES.length * 0.55) / speed, ease: 'none' },
      0.5 / speed,
    )

    // Counter
    tl.to(
      {},
      {
        duration: (MESSAGES.length * 0.55) / speed,
        ease: 'none',
        onUpdate() {
          const p = Math.round(this.progress() * 100)
          if (progressPctRef.current) progressPctRef.current.textContent = `${p}%`
        },
      },
      0.5 / speed,
    )

    // 5. Launch complete
    tl.to(messageRef.current, { opacity: 0, duration: 0.25 / speed })
    tl.call(() => {
      if (messageRef.current) messageRef.current.textContent = '✓ Launch Complete'
    })
    tl.to(messageRef.current, { opacity: 1, duration: 0.3 / speed })

    // 6. Fade out entire overlay
    tl.to(
      wrapperRef.current,
      {
        opacity: 0,
        duration: 0.7 / speed,
        ease: 'power2.inOut',
        delay: 0.4 / speed,
        pointerEvents: 'none',
      },
    )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={wrapperRef}
      aria-live="polite"
      aria-label="Portfolio loading"
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         100,
        backgroundColor:'#050816',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      {/* ── Animated grid lines (CSS only) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* ── Center content ── */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 24px' }}>

        {/* Name */}
        <h1
          aria-label="Pranjal Bhatnagar"
          style={{
            fontFamily: 'var(--font-syne), system-ui, sans-serif',
            fontSize:   'clamp(2rem, 7vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#F1F5F9',
            marginBottom: '1rem',
            overflow: 'hidden',
          }}
        >
          {NAME_CHARS.map((char, i) => (
            <span
              key={i}
              className="loader-char"
              style={{
                display:       'inline-block',
                overflow:      'hidden',
                whiteSpace:    char === ' ' ? 'pre' : 'normal',
                verticalAlign: 'bottom',
              }}
            >
              <span
                ref={(el) => { if (el) charsRef.current[i] = el }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily:    'var(--font-manrope), system-ui, sans-serif',
            fontSize:      'clamp(0.8rem, 2vw, 1rem)',
            color:         '#06B6D4',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom:  '3rem',
          }}
        >
          Computer Science Student
        </p>

        {/* Loading message */}
        <p
          ref={messageRef}
          style={{
            fontFamily:    'var(--font-mono), monospace',
            fontSize:      '0.8rem',
            color:         '#94A3B8',
            letterSpacing: '0.06em',
            minHeight:     '1.4em',
            marginBottom:  '2rem',
          }}
        />

        {/* Progress bar */}
        <div
          style={{
            width:        'min(380px, 80vw)',
            margin:       '0 auto',
            position:     'relative',
          }}
        >
          {/* Track */}
          <div
            style={{
              height:          '2px',
              background:      'rgba(255,255,255,0.08)',
              borderRadius:    '2px',
              overflow:        'hidden',
              marginBottom:    '0.75rem',
            }}
          >
            {/* Fill */}
            <div
              ref={progressRef}
              style={{
                height:          '100%',
                background:      'linear-gradient(90deg, #06B6D4, #3B82F6, #8B5CF6)',
                borderRadius:    '2px',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Percentage */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'flex-end',
            }}
          >
            <span
              ref={progressPctRef}
              style={{
                fontFamily:    'var(--font-mono), monospace',
                fontSize:      '0.7rem',
                color:         'rgba(6,182,212,0.6)',
                letterSpacing: '0.08em',
              }}
            >
              0%
            </span>
          </div>
        </div>
      </div>

      {/* ── Corner accent lines ── */}
      {[
        { top: 24, left: 24,  borderTop: '1px solid', borderLeft:  '1px solid', width: 32, height: 32 },
        { top: 24, right: 24, borderTop: '1px solid', borderRight: '1px solid', width: 32, height: 32 },
        { bottom: 24, left: 24,  borderBottom: '1px solid', borderLeft:  '1px solid', width: 32, height: 32 },
        { bottom: 24, right: 24, borderBottom: '1px solid', borderRight: '1px solid', width: 32, height: 32 },
      ].map((style, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position:    'absolute',
            borderColor: 'rgba(6,182,212,0.3)',
            ...style,
          }}
        />
      ))}
    </div>
  )
}
