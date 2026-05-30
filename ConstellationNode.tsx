'use client'

import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ConstellationNode as NodeType } from '@/types/constellation'
import NodeLabel from './NodeLabel'

interface ConstellationNodeProps {
  node:         NodeType
  onHoverEnter: (node: NodeType) => void
  onHoverLeave: () => void
}

/**
 * ConstellationNode
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single constellation node as:
 *   1. Core sphere — MeshStandardMaterial with emissive + roughness
 *   2. Glow sphere — BackSide transparent MeshBasicMaterial
 *   3. PointLight   — only for institution/start/merged nodes (draw budget)
 *   4. Html label   — via NodeLabel (Drei Html overlay)
 *
 * Animation: all transitions (scale, glow, emissive) are lerped in useFrame
 * to avoid React state re-renders during the animation loop.
 *
 * Hover detection: via R3F pointer events. onPointerOver/Out fire reliably
 * because the Canvas has `raycaster` working on the default scene.
 */
export default function ConstellationNode({
  node,
  onHoverEnter,
  onHoverLeave,
}: ConstellationNodeProps) {
  const meshRef  = useRef<THREE.Mesh>(null!)
  const glowRef  = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  const [hovered, setHovered] = useState(false)

  // Unique phase per node so they don't all pulse in sync
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  const isMain = node.type !== 'skill' && node.type !== 'current'
  const baseSize = node.size ?? 0.1

  // Lerp targets stored as refs — no setState in the render loop
  const scaleTarget   = useRef(1)
  const emissiveTarget= useRef(isMain ? 2.0 : 1.5)
  const glowOpTarget  = useRef(0.06)

  // Update targets when hover changes (this is fine — called from event handler)
  const handleEnter = useCallback(() => {
    setHovered(true)
    scaleTarget.current    = 1.45
    emissiveTarget.current = 3.8
    glowOpTarget.current   = 0.18
    onHoverEnter(node)
  }, [node, onHoverEnter])

  const handleLeave = useCallback(() => {
    setHovered(false)
    scaleTarget.current    = 1.0
    emissiveTarget.current = isMain ? 2.0 : 1.5
    glowOpTarget.current   = 0.06
    onHoverLeave()
  }, [isMain, onHoverLeave])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const pulse = Math.sin(state.clock.elapsedTime * 1.6 + phase) * 0.10 + 0.90

    // Scale — smooth lerp
    const cs = meshRef.current.scale.x
    const ns = THREE.MathUtils.lerp(cs, scaleTarget.current, delta * 9)
    meshRef.current.scale.setScalar(ns)

    // Emissive intensity
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      emissiveTarget.current * pulse,
      delta * 8,
    )

    // Glow sphere
    if (glowRef.current) {
      const gm = glowRef.current.material as THREE.MeshBasicMaterial
      gm.opacity = THREE.MathUtils.lerp(gm.opacity, glowOpTarget.current * pulse, delta * 6)

      const gs = hovered ? 3.4 : 2.3
      glowRef.current.scale.setScalar(
        THREE.MathUtils.lerp(glowRef.current.scale.x, gs, delta * 6),
      )
    }

    // Point light (main nodes only)
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        (hovered ? 3.2 : 1.4) * pulse,
        delta * 6,
      )
    }
  })

  return (
    <group position={node.position}>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); handleEnter() }}
        onPointerOut={(e)  => { e.stopPropagation(); handleLeave() }}
        renderOrder={2}
      >
        <sphereGeometry args={[baseSize, 20, 20]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isMain ? 2.0 : 1.5}
          roughness={0.1}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef} renderOrder={1}>
        <sphereGeometry args={[baseSize, 10, 10]} />
        <meshBasicMaterial
          color={node.glowColor}
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Point light — only main nodes to save draw calls */}
      {isMain && (
        <pointLight
          ref={lightRef}
          color={node.color}
          intensity={1.4}
          distance={4}
          decay={2}
        />
      )}

      {/* Always-visible label for institution/start/merged */}
      {isMain && <NodeLabel node={node} showSub />}

      {/* Skill label appears only on hover */}
      {!isMain && hovered && <NodeLabel node={node} yOffset={0.18} showSub={false} />}
    </group>
  )
}
