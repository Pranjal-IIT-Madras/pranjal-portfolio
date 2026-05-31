'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ScrollProgress    from '@/components/layout/ScrollProgress'
import Header            from '@/components/layout/Header'
import HeroSection       from '@/components/sections/Hero'
import JourneySection    from '@/components/sections/Journey'
import AboutSection      from '@/components/sections/About'
import EducationSection  from '@/components/sections/Education'
import SkillsSection     from '@/components/sections/Skills'
import LeadershipSection from '@/components/sections/Leadership'
import ProjectsSection   from '@/components/sections/Projects'
import GitHubSection     from '@/components/sections/GitHub'

// ── Dynamic imports — Three.js & browser-only code ────────────────────────────
const GalaxyBackground = dynamic(() => import('@/components/canvas/GalaxyBackground'), { ssr: false })
const LoadingScreen    = dynamic(() => import('@/components/loader/LoadingScreen'),    { ssr: false })
const CustomCursor     = dynamic(() => import('@/components/cursor/CustomCursor'),     { ssr: false })

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
  }, [loaded])

  return (
    <>
      <CustomCursor />
      <GalaxyBackground />
      {loaded && <ScrollProgress />}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <div
        className="relative z-10"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        aria-hidden={!loaded}
      >
        <Header />

        <main id="main-content">
          <HeroSection />
          <JourneySection />
          <AboutSection />
          <EducationSection />
          <SkillsSection />
          <LeadershipSection />
          <ProjectsSection />
          <GitHubSection />
          {/* Phase 5: Certifications, Terminal, Contact, Footer */}
        </main>
      </div>
    </>
  )
}
