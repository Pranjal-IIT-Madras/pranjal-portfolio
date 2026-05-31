'use client'

import { motion } from 'framer-motion'
import type { SkillCategory as SkillCategoryType } from '@/constants/skills'
import SkillOrb from './SkillOrb'
import { staggerContainer, itemVariants } from '@/lib/animations/framer-variants'

interface SkillCategoryProps {
  category:   SkillCategoryType
  /** Whether this category is the active tab */
  active?:    boolean
  delay?:     number
}

/**
 * SkillCategory
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single skill category as a glass panel containing
 * a responsive grid of SkillOrbs.
 *
 * Used by Skills/index.tsx in tab-switching mode:
 * - When active: visible, animates in
 * - When inactive: AnimatePresence unmounts it cleanly
 *
 * Grid layout:
 * - 2 columns on mobile
 * - 3 columns on sm
 * - 4+ columns on lg (fewer items fill naturally)
 */
export default function SkillCategory({
  category,
  active = true,
  delay  = 0,
}: SkillCategoryProps) {
  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-8">
        {/* Colored indicator */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: category.color, boxShadow: `0 0 8px ${category.color}` }}
          aria-hidden
        />
        <h3
          className="font-syne font-bold text-white"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
        >
          {category.label}
        </h3>
        <span
          className="ml-auto font-mono text-[9px] tracking-[0.15em] uppercase"
          style={{ color: `${category.color}90` }}
        >
          {category.skills.length} skills
        </span>
      </div>

      {/* Orb grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8"
        role="list"
        aria-label={`${category.label} skills`}
      >
        {category.skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            variants={itemVariants}
            role="listitem"
            className="flex justify-center"
          >
            <SkillOrb
              skill={skill}
              color={category.color}
              delay={i * 0.06}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
