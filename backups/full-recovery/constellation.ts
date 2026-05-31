// ─── Node Types ──────────────────────────────────────────────────────────────

export type NodeType = 'start' | 'institution' | 'skill' | 'merged' | 'current'
export type PathSide = 'left' | 'right' | 'center'

export interface ConstellationNode {
  id: string
  label: string
  sublabel?: string
  position: [number, number, number]
  type: NodeType
  color: string
  glowColor: string
  description?: string
  details?: string[]
  path?: PathSide
  /** Radius of the sphere in Three.js units */
  size?: number
  /** Icon name from lucide-react, shown in the HTML overlay */
  icon?: string
}

// ─── Connection Types ─────────────────────────────────────────────────────────

export interface ConstellationConnection {
  id: string
  from: string
  to: string
  color: string
  /** Whether particles flow along this path */
  animated?: boolean
  /** Particle travel speed (0.1 = slow, 1.0 = fast) */
  flowSpeed?: number
  /** Number of simultaneous flowing particles */
  particleCount?: number
  /** Tube radius (default: 0.006) */
  tubeRadius?: number
}

// ─── Scene Config ─────────────────────────────────────────────────────────────

export interface ConstellationConfig {
  nodes: ConstellationNode[]
  connections: ConstellationConnection[]
}

// ─── Interaction State ────────────────────────────────────────────────────────

export interface HoveredNodeState {
  node: ConstellationNode
  screenPosition: { x: number; y: number }
}
