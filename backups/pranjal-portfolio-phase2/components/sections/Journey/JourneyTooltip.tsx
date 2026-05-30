'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ConstellationNode } from '@/types/constellation'

interface JourneyTooltipProps {
  node:      ConstellationNode | null
  /** Position in CSS pixel space relative to the containing section */
  position:  { x: number; y: number }
}

const TYPE_COLOR: Record<string, string> = {
  start:       '#E8D5A3',
  institution: '',        // per-node color
  skill:       '',
  merged:      '#C084FC',
  current:     '#E879F9',
}

/**
 * JourneyTooltip
 * ─────────────────────────────────────────────────────────────────────────────
 * HTML overlay tooltip displayed when the user hovers a constellation node.
 * Uses AnimatePresence for smooth mount/unmount.
 *
 * Positioning: the R3F scene passes screen-space coordinates via
 * project() in ConstellationScene; we offset by -50% X and 12px Y
 * to appear above the node.
 *
 * Smart clamping: if the tooltip would go off-screen left/right,
 * it shifts. This is handled by CSS min/max on the transform.
 */
export default function JourneyTooltip({ node, position }: JourneyTooltipProps) {
  if (!node) return null

  const accentColor = node.color

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{    opacity: 0, y: 4, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-30 pointer-events-none"
          style={{
            left:      `${position.x}px`,
            top:       `${position.y}px`,
            transform: 'translate(-50%, -100%) translateY(-16px)',
          }}
          role="tooltip"
          aria-live="polite"
        >
          {/* Card */}
          <div
            className="glass rounded-xl px-4 py-3 min-w-[180px] max-w-[260px]"
            style={{
              borderColor: `${accentColor}30`,
              boxShadow: `
                0 4px 24px rgba(0,0,0,0.5),
                0 0 20px ${accentColor}15,
                inset 0 1px 0 rgba(255,255,255,0.06)
              `,
            }}
          >
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              {/* Color dot */}
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full mt-1"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
                aria-hidden
              />
              <div>
                <p
                  className="font-syne font-bold text-white leading-tight"
                  style={{ fontSize: '13px', color: accentColor }}
                >
                  {node.label}
                </p>
                {node.sublabel && (
                  <p
                    className="font-manrope text-[var(--text-muted)] leading-tight mt-0.5"
                    style={{ fontSize: '10px' }}
                  >
                    {node.sublabel}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {node.description && (
              <p
                className="font-manrope text-[var(--text-secondary)] mb-2"
                style={{ fontSize: '11px', lineHeight: 1.5 }}
              >
                {node.description}
              </p>
            )}

            {/* Detail chips */}
            {node.details && node.details.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {node.details.map((detail) => (
                  <span
                    key={detail}
                    className="font-mono text-[9px] tracking-wider rounded-full px-2 py-0.5"
                    style={{
                      color:      accentColor,
                      background: `${accentColor}15`,
                      border:     `1px solid ${accentColor}25`,
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arrow pointing down */}
          <div
            aria-hidden
            className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2"
            style={{
              width:  0,
              height: 0,
              borderLeft:   '6px solid transparent',
              borderRight:  '6px solid transparent',
              borderTop:    `6px solid ${accentColor}30`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
