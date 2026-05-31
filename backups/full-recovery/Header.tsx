'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, ExternalLink } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS } from '@/constants/navigation'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useCursor } from '@/components/cursor/CursorContext'
import { cn } from '@/lib/utils/cn'
import { useLenis } from '@/components/providers/SmoothScrollProvider'

/**
 * Header
 * ─────────────────────────────────────────────────────────────────────────────
 * Sticky top navigation.
 * - Transparent at top, glassmorphic once user scrolls past 60px.
 * - Mobile: hamburger → full-screen overlay drawer.
 * - Scroll to section via Lenis.scrollTo (smooth anchor navigation).
 * - All interactive elements update CursorContext.
 */
export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const lenis = useLenis()
  const { enterLink, enterButton, leaveAll } = useCursor()
  const headerRef = useRef<HTMLElement>(null)

  // ── Scroll detection ─────────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Active section via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    const targets = NAV_LINKS.map(({ href }) =>
      document.querySelector(href),
    ).filter(Boolean) as Element[]

    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection('#' + entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // ── Navigation handler ───────────────────────────────────────────────────
  function navigateTo(href: string) {
    setMobileOpen(false)
    if (lenis) {
      lenis.scrollTo(href, { offset: -80, duration: 1.4 })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ── Lock body scroll when mobile menu open ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        ref={headerRef}
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          scrolled
            ? 'bg-[#050816]/70 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent',
        )}
      >
        <nav
          className="flex items-center justify-between max-w-[1280px] mx-auto px-6 md:px-10"
          style={{ height: '68px' }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={() => navigateTo('#main-content')}
            onMouseEnter={enterLink}
            onMouseLeave={leaveAll}
            aria-label="Back to top"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-sm"
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-[var(--cyan)] to-[var(--blue)]',
                'text-white font-bold text-sm font-[var(--font-syne)]',
                'shadow-glow-sm-cyan',
                'transition-transform duration-200 group-hover:scale-105',
              )}
            >
              PB
            </div>
            <span
              className={cn(
                'font-syne font-bold text-[0.9rem] tracking-tight',
                'text-white/90 group-hover:text-white transition-colors',
                'hidden sm:block',
              )}
            >
              Pranjal Bhatnagar
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href
              return (
                <li key={href}>
                  <button
                    onClick={() => navigateTo(href)}
                    onMouseEnter={enterLink}
                    onMouseLeave={leaveAll}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative px-4 py-2 rounded-lg text-sm font-medium font-manrope',
                      'transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
                      isActive
                        ? 'text-[var(--cyan)]'
                        : 'text-white/60 hover:text-white/90',
                    )}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--cyan)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* GitHub link */}
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={enterLink}
              onMouseLeave={leaveAll}
              aria-label="GitHub profile"
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono',
                'text-white/50 hover:text-white/90',
                'border border-white/[0.08] hover:border-[var(--cyan)]/30',
                'transition-all duration-200',
              )}
            >
              <Github size={13} />
              <span>GitHub</span>
              <ExternalLink size={10} className="opacity-60" />
            </a>

            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              onMouseEnter={enterButton}
              onMouseLeave={leaveAll}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              className={cn(
                'md:hidden flex items-center justify-center',
                'w-9 h-9 rounded-full',
                'bg-white/5 hover:bg-white/10',
                'border border-white/10',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{    opacity: 0, rotate: 30  }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  {mobileOpen
                    ? <X size={16} className="text-white/80" />
                    : <Menu size={16} className="text-white/80" />
                  }
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'fixed inset-0 z-40 md:hidden',
              'bg-[#050816]/95 backdrop-blur-xl',
              'flex flex-col items-center justify-center gap-8',
            )}
          >
            <nav>
              <ul className="flex flex-col items-center gap-4" role="list">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0  }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <button
                      onClick={() => navigateTo(href)}
                      className="font-syne font-bold text-3xl text-white/80 hover:text-[var(--cyan)] transition-colors duration-200"
                    >
                      {label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-mono transition-colors"
            >
              <Github size={16} />
              github.com/Pranjal-Bhatnagar
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
