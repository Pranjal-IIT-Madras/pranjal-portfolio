/**
 * galaxy-geometry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure utility for generating star-field BufferGeometry attributes.
 * Kept framework-free so it can be moved to a Worker if needed.
 *
 * Performance rationale:
 *  - useMemo wraps these calls in components so they run once per mount.
 *  - Float32Array is used instead of Array for direct GPU upload (no copy).
 *  - Sphere distribution (acos trick) is O(n) with no rejection sampling.
 */

export interface StarFieldData {
  positions: Float32Array
  colors:    Float32Array
  sizes:     Float32Array
}

/**
 * generateStarField
 * Produces positions, vertex colours, and per-vertex sizes for a star field.
 *
 * @param count  Number of stars
 * @param spread Maximum radius in Three.js world units
 * @param bias   Power applied to radius — lower = more central concentration
 */
export function generateStarField(
  count:  number,
  spread: number,
  bias = 0.4,
): StarFieldData {
  const positions = new Float32Array(count * 3)
  const colors    = new Float32Array(count * 3)
  const sizes     = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // Uniform sphere distribution
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = Math.pow(Math.random(), bias) * spread

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // Star colour distribution (realistic stellar palette)
    const roll = Math.random()
    if (roll < 0.62) {
      // Blue-white (O/B class dominant in a deep-sky view)
      const v = 0.75 + Math.random() * 0.25
      colors[i * 3]     = v * 0.88
      colors[i * 3 + 1] = v * 0.93
      colors[i * 3 + 2] = 1.0
    } else if (roll < 0.80) {
      // White (A class)
      const v = 0.9 + Math.random() * 0.1
      colors[i * 3]     = v
      colors[i * 3 + 1] = v
      colors[i * 3 + 2] = v
    } else if (roll < 0.89) {
      // Warm white / yellow-white (F/G class)
      colors[i * 3]     = 1.0
      colors[i * 3 + 1] = 0.92 + Math.random() * 0.08
      colors[i * 3 + 2] = 0.75 + Math.random() * 0.15
    } else if (roll < 0.95) {
      // Electric cyan (portfolio accent)
      colors[i * 3]     = 0.05
      colors[i * 3 + 1] = 0.75 + Math.random() * 0.25
      colors[i * 3 + 2] = 0.90
    } else {
      // Cosmic blue (portfolio accent)
      colors[i * 3]     = 0.25
      colors[i * 3 + 1] = 0.55
      colors[i * 3 + 2] = 1.0
    }

    sizes[i] = Math.random() * 1.4 + 0.3
  }

  return { positions, colors, sizes }
}

/**
 * createNebulaTexture
 * Returns a base64 PNG of a radial gradient — used as a Sprite texture
 * for nebula cloud effects.
 *
 * @param r  Red channel 0-255
 * @param g  Green channel 0-255
 * @param b  Blue channel 0-255
 */
export function createNebulaTexture(r: number, g: number, b: number): string {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  )
  gradient.addColorStop(0,   `rgba(${r},${g},${b},0.5)`)
  gradient.addColorStop(0.3, `rgba(${r},${g},${b},0.25)`)
  gradient.addColorStop(0.7, `rgba(${r},${g},${b},0.05)`)
  gradient.addColorStop(1,   `rgba(${r},${g},${b},0)`)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return canvas.toDataURL()
}
