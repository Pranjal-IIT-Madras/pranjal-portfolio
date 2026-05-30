'use client'

import { useRef, useState, useCallback, type RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ConstellationNode } from '@/types/constellation'
import ConstellationScene from '@/components/canvas/ConstellationScene'
import JourneyTooltip from './JourneyTooltip'
import { useIsMobile } from '@/hooks/useMediaQuery'

// ── Coordinate projection utility ─────────────────────────────────────────────
function useProjectedPosition() {
  const { camera, size } = useThree()

  return useCallback((worldPos: THREE.Vector3): { x: number; y: number } => {
    const vec = worldPos.clone()
    vec.project(camera)
    return {
      x: (vec.x  *  0.5 + 0.5) * size.width,
      y: (-vec.y * 0.5 + 0.5) * size.height,
    }
  }, [camera, size])
}

// ── Inner scene wrapper (needs useThree, so must live inside Canvas) ───────────
interface InnerSceneProps {
  scrollProgressRef:    RefObject<number>
  onNodeHover:          (node: ConstellationNode | null, pos: { x: number; y: number }) => void
}

function InnerScene({ scrollProgressRef, onNodeHover }: InnerSceneProps) {
  const project = useProjectedPosition()

  const handleNodeHover = useCallback((node: ConstellationNode | null) => {
    if (!node) {
      onNodeHover(null, { x: 0, y: 0 })
      return
    }
    // Project the 3D node position to 2D canvas coordinates
    const worldPos = new THREE.Vector3(...node.position)
    worldPos.y += (node.size ?? 0.1) + 0.4 // position tooltip above the sphere
    const screenPos = project(worldPos)
    onNodeHover(node, screenPos)
  }, [project, onNodeHover])

  return (
    <ConstellationScene
      scrollProgressRef={scrollProgressRef}
      onNodeHover={handleNodeHover}
    />
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
interface JourneyConstellationProps {
  scrollProgressRef: RefObject<number>
}

/**
 * JourneyConstellation
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts the R3F Canvas for the constellation scene.
 * Manages the tooltip state bridge between WebGL hover events and the
 * HTML overlay tooltip.
 *
 * Architecture:
 *  Canvas → ConstellationScene → ConstellationNode fires onHoverEnter
 *         → InnerScene projects 3D coords to 2D screen space
 *         → JourneyConstellation stores (hoveredNode, screenPos) in state
 *         → JourneyTooltip renders as an absolutely positioned HTML overlay
 *
 * The Canvas uses position:absolute to fill its container (the section).
 * pointer-events:none on the tooltip ensures it doesn't eat hover events.
 *
 * Performance:
 *  - dpr capped at 1.5 — this scene is detail-rich; 2× DPR doubles
 *    the fragment shader cost for minimal visible gain.
 *  - antialias:true — the glowing node spheres need MSAA to look premium.
 *  - frameloop:'always' — nodes animate continuously.
 */
export default function JourneyConstellation({
  scrollProgressRef,
}: JourneyConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile     = useIsMobile()

  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null)
  const [tooltipPos,  setTooltipPos]  = useState({ x: 0, y: 0 })

  const handleNodeHover = useCallback(
    (node: ConstellationNode | null, pos: { x: number; y: number }) => {
      setHoveredNode(node)
      if (pos) setTooltipPos(pos)
    },
    [],
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: isMobile ? '90vh' : '100vh' }}
    >
      <Canvas
        className="constellation-canvas"
        frameloop="always"
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{
          antialias:       true,
          alpha:           true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{
          fov:      55,
          near:     0.1,
          far:      120,
          position: [0, 4.8, 13],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <InnerScene
          scrollProgressRef={scrollProgressRef}
          onNodeHover={handleNodeHover}
        />
      </Canvas>

      {/* HTML tooltip overlay */}
      <JourneyTooltip node={hoveredNode} position={tooltipPos} />

      {/* Mobile: simple instruction label */}
      {isMobile && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          aria-label="Tap nodes to explore"
        >
          <p className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase text-center">
            Tap nodes to explore
          </p>
        </div>
      )}
    </div>
  )
}
