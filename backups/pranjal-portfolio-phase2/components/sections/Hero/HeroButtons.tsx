'use client'

import { motion } from 'framer-motion'
import { ArrowDown, FolderOpen, Github, Mail } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { SOCIAL_LINKS } from '@/constants/navigation'
import { useLenis } from '@/components/providers/SmoothScrollProvider'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'

/**
 * HeroButtons
 * ─────────────────────────────────────────────────────────────────────────────
 * Four CTAs rendered after the HeroTitle/RotatingText animation settles:
 *   [View Projects]  [Explore Journey]  [GitHub]  [Contact]
 *
 * On mobile: wraps to two rows, smaller padding.
 * Stagger animation driven by Framer Motion container/item variants.
 * Magnetic pull is from MagneticButton (GSAP).
 */
export default function HeroButtons() {
  const lenis = useLenis()

  function scrollTo(id: string) {
    if (lenis) {
      lenis.scrollTo(id, { offset: -80, duration: 1.4 })
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-3"
    >
      {/* Primary — View Projects */}
      <motion.div variants={itemVariants}>
        <MagneticButton
          variant="primary"
          onClick={() => scrollTo('#projects')}
          ariaLabel="View my projects"
        >
          <FolderOpen size={16} aria-hidden />
          View Projects
        </MagneticButton>
      </motion.div>

      {/* Secondary — Explore Journey */}
      <motion.div variants={itemVariants}>
        <MagneticButton
          variant="secondary"
          onClick={() => scrollTo('#journey')}
          ariaLabel="Explore my academic journey constellation"
        >
          <ArrowDown size={16} aria-hidden />
          Explore Journey
        </MagneticButton>
      </motion.div>

      {/* Ghost — GitHub */}
      <motion.div variants={itemVariants}>
        <MagneticButton
          variant="ghost"
          href={SOCIAL_LINKS.github}
          external
          ariaLabel="Visit GitHub profile (opens in new tab)"
        >
          <Github size={15} aria-hidden />
          GitHub
        </MagneticButton>
      </motion.div>

      {/* Ghost — Contact */}
      <motion.div variants={itemVariants}>
        <MagneticButton
          variant="ghost"
          onClick={() => scrollTo('#contact')}
          ariaLabel="Go to contact section"
        >
          <Mail size={15} aria-hidden />
          Contact
        </MagneticButton>
      </motion.div>
    </motion.div>
  )
}
