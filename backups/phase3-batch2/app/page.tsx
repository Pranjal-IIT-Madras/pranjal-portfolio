'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ScrollProgress  from '@/components/layout/ScrollProgress'
import Header          from '@/components/layout/Header'
import HeroSection     from '@/components/sections/Hero'
import JourneySection  from '@/components/sections/Journey'
import AboutSection    from '@/components/sections/About'
import EducationSection from '@/components/sections/Education'
import SkillsSection   from '@/components/sections/Skills'
import LeadershipSection from '@/components/sections/Leadership'

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

  const handleLoadComplete = () => setLoaded(true)

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
  }, [loaded])

  return (
    <>
      <CustomCursor />
      <GalaxyBackground />
      {loaded && <ScrollProgress />}
      <LoadingScreen onComplete={handleLoadComplete} />

      <div
        className="relative z-10"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        aria-hidden={!loaded}
      >
        <Header />

        <main id="main-content">
          {/* 01 — Identity */}
          <HeroSection />

          {/* 02 — Signature journey constellation */}
          <JourneySection />

          {/* 03 — About */}
          <AboutSection />

          {/* 04 — Education */}
          <EducationSection />

          {/* 05 — Skills */}
          <SkillsSection />

          {/* 06 — Leadership */}
          <LeadershipSection />

          {/* Phase 4 sections slot in here */}
        </main>
      </div>
    </>
  )
}
