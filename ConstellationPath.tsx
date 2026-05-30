'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import type { ConstellationConnection, ConstellationNode } from '@/types/constellation'
import PathParticles from './PathParticles'

interface ConstellationPathProps {
  connection: ConstellationConnection
  nodeMap:    Map<string, ConstellationNode>
  /** Reveal progress 0→1 — tube opacity animates with this */
  reveal?:    number
}

/**
 * ConstellationPath
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds a TubeGeometry between two nodes using a cubic Catmull-Rom spline.
 * The midpoint is slightly offset in Z to give the curve a pleasing arc.
 * For animated connections, PathParticles flows along the same curve.
 *
 * Performance:
 *  - Geometry created once in useMemo, disposed on unmount.
 *  - Material opacity transitions are done via direct property mutation
 *    in parent (reveal prop) — not re-renders.
 *  - tube segments: 64 for main paths, 24 for thin sub-connections.
 */
export default function ConstellationPath({
  connection,
  nodeMap,
  reveal = 1,
}: ConstellationPathProps) {
  const fromNode = nodeMap.get(connection.from)
  const toNode   = nodeMap.get(connection.to)

  // Build spline + geometry
  const { curve, geometry, material } = useMemo(() => {
    if (!fromNode || !toNode) return { curve: null, geometry: null, material: null }

    const from = new THREE.Vector3(...fromNode.position)
    const to   = new THREE.Vector3(...toNode.position)

    // Mid-point with a gentle Z arc to prevent paths overlapping nodes
    const mid = from.clone().lerp(to, 0.5)
    mid.z += connection.animated ? 0.6 : 0.25

    const crv = new THREE.CatmullRomCurve3([from, mid, to])

    const tubeSeg  = connection.animated ? 64 : 24
    const tubeRad  = connection.tubeRadius ?? 0.006

    const geo = new THREE.TubeGeometry(crv, tubeSeg, tubeRad, 6, false)

    const col = new THREE.Color(connection.color)
    const mat = new THREE.MeshBasicMaterial({
      color:       col,
      transparent: true,
      opacity:     connection.animated ? 0.55 : 0.25,
      depthWrite:  false,
      // Slight additive blend makes tubes glow into each other nicely
      blending:    THREE.AdditiveBlending,
    })

    return { curve: crv, geometry: geo, material: mat }
  }, [fromNode, toNode, connection])

  // Dispose on unmount
  useEffect(() => {
    return () => {
      geometry?.dispose()
      material?.dispose()
    }
  }, [geometry, material])

  // Update opacity from reveal prop (0→1 animation driven by parent)
  useEffect(() => {
    if (!material) return
    material.opacity = (connection.animated ? 0.55 : 0.25) * reveal
  }, [reveal, material, connection.animated])

  if (!curve || !geometry || !material) return null

  return (
    <group>
      {/* Tube */}
      <mesh geometry={geometry} material={material} frustumCulled={false} />

      {/* Flowing particles for animated connections */}
      {connection.animated && (
        <PathParticles
          curve={curve}
          count={connection.particleCount ?? 10}
          color={connection.color}
          speed={connection.flowSpeed ?? 0.4}
          active={reveal > 0.5}
        />
      )}
    </group>
  )
}
