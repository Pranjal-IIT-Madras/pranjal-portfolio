'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { generateStarField, createNebulaTexture } from '@/lib/three/galaxy-geometry'
import { useMousePosition } from '@/hooks/useMousePosition'

// ── Nebula cloud config ────────────────────────────────────────────────────────
const NEBULAE = [
  { pos: [-18, 8, -30] as [number,number,number],  rgb: [6, 182, 212]  as [number,number,number], scale: 28, opacity: 0.07 },
  { pos: [ 22, -5, -40] as [number,number,number], rgb: [59, 130, 246] as [number,number,number], scale: 35, opacity: 0.05 },
  { pos: [ -8, -14, -25] as [number,number,number],rgb: [139, 92, 246] as [number,number,number], scale: 22, opacity: 0.05 },
  { pos: [ 10, 14, -35] as [number,number,number], rgb: [6, 182, 212]  as [number,number,number], scale: 18, opacity: 0.04 },
]

// ── Star layer config ─────────────────────────────────────────────────────────
const LAYERS = [
  { count: 2200, spread: 45, bias: 0.38, size: 0.022, parallax: 0.28 },
  { count: 3200, spread: 80, bias: 0.42, size: 0.013, parallax: 0.14 },
  { count: 1800, spread: 130,bias: 0.50, size: 0.006, parallax: 0.05 },
]
const MOBILE_LAYERS = [
  { count: 700,  spread: 45,  bias: 0.38, size: 0.022, parallax: 0 },
  { count: 800,  spread: 80,  bias: 0.42, size: 0.013, parallax: 0 },
]

interface LayerMeshes {
  near:  React.RefObject<THREE.Points>
  mid:   React.RefObject<THREE.Points>
  far:   React.RefObject<THREE.Points>
}

// ── Star Layer component (one layer per instance) ─────────────────────────────
function StarLayer({
  layerRef,
  count,
  spread,
  bias,
  size,
  parallaxFactor,
  mouseRef,
}: {
  layerRef: React.Ref<THREE.Points>
  count: number
  spread: number
  bias: number
  size: number
  parallaxFactor: number
  mouseRef: ReturnType<typeof useMousePosition>
}) {
  const { positions, colors, sizes } = useMemo(
    () => generateStarField(count, spread, bias),
    [count, spread, bias],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,  1))
    return geo
  }, [positions, colors, sizes])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size:            size,
        sizeAttenuation: true,
        vertexColors:    true,
        transparent:     true,
        opacity:         0.88,
        depthWrite:      false,
      }),
    [size],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  const originX = useRef(0)
  const originY = useRef(0)

  useFrame((_, delta) => {
    if (!layerRef || typeof layerRef === 'function' || !layerRef.current) return
    const { nx, ny } = mouseRef.current

    // Smooth lerp toward mouse-driven offset
    originX.current = THREE.MathUtils.lerp(originX.current, nx * parallaxFactor, delta * 1.2)
    originY.current = THREE.MathUtils.lerp(originY.current, ny * parallaxFactor, delta * 1.2)

    layerRef.current.position.x = originX.current
    layerRef.current.position.y = originY.current
  })

  return <primitive object={new THREE.Points(geometry, material)} ref={layerRef} />
}

// ── Nebula Sprite component ───────────────────────────────────────────────────
function NebulaSprite({
  position,
  rgb,
  scale,
  opacity,
}: {
  position: [number, number, number]
  rgb: [number, number, number]
  scale: number
  opacity: number
}) {
  const texture = useMemo(() => {
    const dataUrl = createNebulaTexture(...rgb)
    const tex = new THREE.TextureLoader().load(dataUrl)
    return tex
  }, [rgb])

  const material = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map:         texture,
        transparent: true,
        opacity:     opacity,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
      }),
    [texture, opacity],
  )

  useEffect(() => {
    return () => {
      texture.dispose()
      material.dispose()
    }
  }, [texture, material])

  const spriteRef = useRef<THREE.Sprite>(null!)
  useFrame((state) => {
    if (!spriteRef.current) return
    // Very slow drift
    spriteRef.current.rotation.z = state.clock.elapsedTime * 0.004
  })

  return (
    <sprite ref={spriteRef} position={position} scale={scale}>
      <primitive object={material} attach="material" />
    </sprite>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function GalaxyParticles({ isMobile }: { isMobile: boolean }) {
  const nearRef  = useRef<THREE.Points>(null!)
  const midRef   = useRef<THREE.Points>(null!)
  const farRef   = useRef<THREE.Points>(null!)
  const mouseRef = useMousePosition()

  const layers = isMobile ? MOBILE_LAYERS : LAYERS

  return (
    <group>
      {/* Star layers */}
      <StarLayer
        layerRef={nearRef}
        {...layers[0]}
        parallaxFactor={layers[0].parallax}
        mouseRef={mouseRef}
      />
      <StarLayer
        layerRef={midRef}
        {...layers[1]}
        parallaxFactor={layers[1].parallax}
        mouseRef={mouseRef}
      />
      {!isMobile && layers[2] && (
        <StarLayer
          layerRef={farRef}
          {...layers[2]}
          parallaxFactor={layers[2].parallax}
          mouseRef={mouseRef}
        />
      )}

      {/* Nebula clouds — desktop only (expensive alpha blending) */}
      {!isMobile && NEBULAE.map((n, i) => (
        <NebulaSprite key={i} position={n.pos} rgb={n.rgb} scale={n.scale} opacity={n.opacity} />
      ))}
    </group>
  )
}
