'use client'

import { Html } from '@react-three/drei'
import type { ConstellationNode } from '@/types/constellation'

interface NodeLabelProps {
  node:     ConstellationNode
  /** Y offset above the sphere surface */
  yOffset?: number
  /** Show the sublabel line */
  showSub?: boolean
}

/**
 * NodeLabel
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a text label as an HTML overlay in 3D space using Drei's <Html>.
 * distanceFactor makes the label scale with camera distance.
 * occlude={false} keeps labels visible through geometry.
 *
 * Performance: Html components have a small overhead per label.
 * We only mount NodeLabel for institution/start/merged nodes (~4 total).
 */
export default function NodeLabel({ node, yOffset = 0.3, showSub = true }: NodeLabelProps) {
  const isSkill = node.type === 'skill' || node.type === 'current'

  return (
    <Html
      position={[0, (node.size ?? 0.1) + yOffset, 0]}
      center
      distanceFactor={10}
      occlude={false}
      zIndexRange={[50, 0]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className="node-label-wrapper text-center whitespace-nowrap">
        {isSkill ? (
          <span className="node-label-skill" style={{ color: node.color }}>
            {node.label}
          </span>
        ) : (
          <>
            <div
              className="node-label-main"
              style={{
                color:      node.color,
                textShadow: `0 0 14px ${node.glowColor}80, 0 0 30px ${node.glowColor}40`,
              }}
            >
              {node.label}
            </div>
            {showSub && node.sublabel && (
              <div className="node-label-sub">{node.sublabel}</div>
            )}
          </>
        )}
      </div>
    </Html>
  )
}
