'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useIsMobile } from '@/hooks/useMediaQuery'
import GalaxyParticles from './GalaxyParticles'

/**
 * GalaxyBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Persistent full-screen WebGL canvas fixed behind the entire site.
 * z-index 0 — all page content sits above it.
 * pointer-events: none — never intercepts user interactions.
 *
 * Performance:
 *  - frameloop "always" needed for mouse parallax.
 *  - dpr capped at 1.5 (2.0 on retina is wasteful for a background).
 *  - Camera FOV 75 gives wide enough view for the spread star field.
 *  - Star count halved on mobile via GalaxyParticles' isMobile prop.
 */
export default function GalaxyBackground() {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        // Prevent canvas from creating a new stacking context that breaks z-index
        isolation:     'isolate',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop="always"
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{
          antialias:        false, // not needed for a star field
          alpha:            true,
          powerPreference:  'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{
          fov:      75,
          near:     0.1,
          far:      400,
          position: [0, 0, 1],
        }}
        style={{ background: 'transparent' }}
      >
        {/* Minimal ambient — stars are self-lit via vertexColors */}
        <ambientLight intensity={0.02} />

        <Suspense fallback={null}>
          <GalaxyParticles isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
