'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

/**
 * registerGSAPPlugins
 * ─────────────────────────────────────────────────────────────────────────────
 * Registers all GSAP plugins globally, exactly once.
 * Guard prevents double-registration if React Strict Mode double-invokes.
 *
 * Called from: components/providers/GSAPProvider.tsx (client, top-level useEffect)
 *
 * Performance: gsap.registerPlugin is synchronous, < 1ms overhead.
 */
export function registerGSAPPlugins() {
  if (registered) return
  registered = true

  gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase)

  // ── Global GSAP defaults ──────────────────────────────────────────────────
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.6,
  })

  // ── Prevent GSAP from fighting Lenis scroll ───────────────────────────────
  // Lenis fires a RAF loop; GSAP ScrollTrigger should NOT override scroll pos.
  // We set lagSmoothing to 0 so GSAP doesn't try to compensate for dropped frames.
  gsap.ticker.lagSmoothing(0)

  // ── Custom easing curves ──────────────────────────────────────────────────
  CustomEase.create('cosmic', '0.16, 1, 0.3, 1')          // out-expo feel
  CustomEase.create('spring', '0.34, 1.56, 0.64, 1')       // slight overshoot
  CustomEase.create('cinematic', '0.25, 0.46, 0.45, 0.94') // elegant out
}

// ── Re-export so consumers can use GSAP with correct plugin access ────────────
export { gsap, ScrollTrigger }
