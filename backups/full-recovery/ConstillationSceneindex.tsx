'use client'

import {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
  type RefObject,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CONSTELLATION_CONFIG } from '@/constants/constellation-data'
import type { ConstellationNode } from '@/types/constellation'
import ConstellationNodeComp from './ConstellationNode'
import ConstellationPath from './ConstellationPath'

// ── Camera keyframes ──────────────────────────────────────────────────────────
interface CameraKF {
  progress: number
  pos:      [number, number, number]
  target:   [number, number, number]
}

const CAMERA_KF: CameraKF[] = [
  { progress: 0,    pos: [ 0,   4.8, 13 ], target: [ 0,  3.2,  0] },
  { progress: 0.18, pos: [-1.5, 2.5, 12 ], target: [-1,  0.5,  0] },
  { progress: 0.35, pos: [ 1.5, 2.5, 12 ], target: [ 1,  0.5,  0] },
  { progress: 0.55, pos: [ 0,   0.5, 14 ], target: [ 0,  0,    0] },
  { progress: 0.75, pos: [ 0,  -2,   12 ], target: [ 0, -3,    0] },
  { progress: 1,    pos: [ 0,  -4.2, 13 ], target: [ 0, -4.2,  0] },
]

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

function lerpCamera(progress: number): { pos: THREE.Vector3; target: THREE.Vector3 } {
  let prev = CAMERA_KF[0]
  let next = CAMERA_KF[CAMERA_KF.length - 1]

  for (let i = 0; i < CAMERA_KF.length - 1; i++) {
    if (progress >= CAMERA_KF[i].progress && progress <= CAMERA_KF[i + 1].progress) {
      prev = CAMERA_KF[i]
      next = CAMERA_KF[i + 1]
      break
    }
  }

  const range = next.progress - prev.progress
  const local = range > 0 ? (progress - prev.progress) / range : 0
  const t = smoothstep(local)

  return {
    pos: new THREE.Vector3(
      THREE.MathUtils.lerp(prev.pos[0], next.pos[0], t),
      THREE.MathUtils.lerp(prev.pos[1], next.pos[1], t),
      THREE.MathUtils.lerp(prev.pos[2], next.pos[2], t),
    ),
    target: new THREE.Vector3(
      THREE.MathUtils.lerp(prev.target[0], next.target[0], t),
      THREE.MathUtils.lerp(prev.target[1], next.target[1], t),
      THREE.MathUtils.lerp(prev.target[2], next.target[2], t),
    ),
  }
}

// ── Camera Controller (lives inside the Canvas) ───────────────────────────────
function CameraController({
  scrollProgressRef,
}: {
  scrollProgressRef: RefObject<number>
}) {
  const { camera } = useThree()

  const smoothPos    = useRef(new THREE.Vector3(...CAMERA_KF[0].pos))
  const smoothTarget = useRef(new THREE.Vector3(...CAMERA_KF[0].target))

  // Gentle auto-rotate (applied on top of scroll movement)
  const autoAngle = useRef(0)

  useFrame((_, delta) => {
    const progress = scrollProgressRef.current ?? 0
    const { pos, target } = lerpCamera(progress)

    // Slow drift rotation on the camera's orbit
    autoAngle.current += delta * 0.06
    const orbitRadius = 0.3
    pos.x += Math.sin(autoAngle.current) * orbitRadius * (1 - progress)

    // Smooth follow — lerp speed increases with scroll speed
    const lerpSpeed = 2.2
    smoothPos.current.lerp(pos, delta * lerpSpeed)
    smoothTarget.current.lerp(target, delta * lerpSpeed)

    camera.position.copy(smoothPos.current)
    camera.lookAt(smoothTarget.current)
  })

  return null
}

// ── Scene Lighting ─────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      {/* Very dim ambient so dark materials don't go pitch black */}
      <ambientLight intensity={0.06} color="#0F172A" />

      {/* Accent fill lights from top-left and bottom-right */}
      <pointLight position={[-8, 6, 4]}  color="#06B6D4" intensity={0.5} distance={20} />
      <pointLight position={[ 8, -6, 4]} color="#3B82F6" intensity={0.4} distance={20} />
      <pointLight position={[ 0, -5, 6]} color="#8B5CF6" intensity={0.3} distance={15} />
    </>
  )
}

// ── Main Scene ────────────────────────────────────────────────────────────────
interface ConstellationSceneProps {
  scrollProgressRef: RefObject<number>
  onNodeHover:       (node: ConstellationNode | null) => void
}

export default function ConstellationScene({
  scrollProgressRef,
  onNodeHover,
}: ConstellationSceneProps) {
  const { nodes, connections } = CONSTELLATION_CONFIG

  // Build a Map for O(1) node lookup by connection endpoints
  const nodeMap = useMemo(() => {
    const map = new Map<string, ConstellationNode>()
    nodes.forEach((n) => map.set(n.id, n))
    return map
  }, [nodes])

  const handleHoverEnter = useCallback((node: ConstellationNode) => {
    onNodeHover(node)
  }, [onNodeHover])

  const handleHoverLeave = useCallback(() => {
    onNodeHover(null)
  }, [onNodeHover])

  return (
    <>
      <SceneLighting />

      {/* Subtle fog for depth — very long range so distant nodes still show */}
      <fog attach="fog" args={['#050816', 18, 55]} />

      <CameraController scrollProgressRef={scrollProgressRef} />

      {/* All connection paths */}
      <group name="paths">
        {connections.map((conn) => (
          <ConstellationPath
            key={conn.id}
            connection={conn}
            nodeMap={nodeMap}
            reveal={1}
          />
        ))}
      </group>

      {/* All nodes */}
      <group name="nodes">
        {nodes.map((node) => (
          <ConstellationNodeComp
            key={node.id}
            node={node}
            onHoverEnter={handleHoverEnter}
            onHoverLeave={handleHoverLeave}
          />
        ))}
      </group>
    </>
  )
}
