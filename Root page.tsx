'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ScrollProgress from '@/components/layout/ScrollProgress'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/Hero'
import JourneySection from '@/components/sections/Journey'

// ── Dynamic imports — Three.js requires browser APIs (no SSR) ─────────────────
const GalaxyBackground = dynamic(
  () => import('@/components/canvas/GalaxyBackground'),
  { ssr: false },
)

const LoadingScreen = dynamic(
  () => import('@/components/loader/LoadingScreen'),
  { ssr: false },
)

const CustomCursor = dynamic(
  () => import('@/components/cursor/CustomCursor'),
  { ssr: false },
)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)

  // Once loading screen calls onComplete, reveal the site
  const handleLoadComplete = () => setLoaded(true)

  // Prevent flash of content before loader mounts
  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
  }, [loaded])

  return (
    <>
      {/* Custom cursor — only for fine-pointer devices */}
      <CustomCursor />

      {/* Persistent galaxy environment — fixed behind all content */}
      <GalaxyBackground />

      {/* Scroll progress bar */}
      {loaded && <ScrollProgress />}

      {/* Cinematic loading screen */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* ── Main content — hidden until loading completes ── */}
      <div
        className="relative z-10"
        style={{
          opacity:    loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
        aria-hidden={!loaded}
      >
        <Header />

        <main id="main-content">
          {/* 01 — Identity */}
          <HeroSection />

          {/* 02 — Signature journey constellation */}
          <JourneySection />

          {/* Additional sections load here after review */}
        </main>
      </div>
    </>
  )
}
