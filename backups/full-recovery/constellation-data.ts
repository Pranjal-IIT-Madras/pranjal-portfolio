import type { ConstellationConfig } from '@/types/constellation'

/**
 * COORDINATE SYSTEM
 * ─────────────────
 * Y+ = up, Y− = down (standard Three.js)
 * X− = left (VIT path), X+ = right (IIT path)
 * Z varies for depth layering
 *
 * LAYOUT (approximate)
 * ─────────────────────
 *          [DPS KPV — Y:3.2]
 *         /                 \
 *   [VIT — X:−3.2, Y:0.5]  [IIT — X:3.2, Y:0.5]
 *    |___|___|___|___|        |___|___|___|___|
 *         \                 /
 *       [CURRENT FOCUS — Y:−3.2]
 *           |___|___|___|
 */

export const CONSTELLATION_CONFIG: ConstellationConfig = {
  // ─── NODES ──────────────────────────────────────────────────────────────────
  nodes: [
    // ── START ─────────────────────────────────────────────────────────────────
    {
      id: 'dps-kvp',
      label: 'DPS KPV',
      sublabel: 'Greater Noida',
      position: [0, 3.2, 0],
      type: 'start',
      color: '#E8D5A3',
      glowColor: '#FFD580',
      size: 0.18,
      path: 'center',
      description: 'Where the journey began.',
      details: ['Head Boy', 'Leadership', 'Python', 'Senior Secondary Education'],
      icon: 'GraduationCap',
    },

    // ── LEFT PATH — VIT BHOPAL ────────────────────────────────────────────────
    {
      id: 'vit-bhopal',
      label: 'VIT Bhopal',
      sublabel: 'B.Tech Computer Science Engineering',
      position: [-3.2, 0.5, 0],
      type: 'institution',
      color: '#06B6D4',
      glowColor: '#06B6D4',
      size: 0.16,
      path: 'left',
      description: 'Engineering excellence. Building the software foundation.',
      details: ['Computer Science Engineering', 'Software Development', 'GitHub Projects', 'Open Source'],
      icon: 'Code2',
    },
    {
      id: 'cpp',
      label: 'C++',
      position: [-5.6, 1.1, 0.5],
      type: 'skill',
      color: '#38BDF8',
      glowColor: '#38BDF8',
      size: 0.09,
      path: 'left',
      details: ['Beginner to Advanced progression', 'cpp-practice repository'],
    },
    {
      id: 'oop',
      label: 'OOP',
      position: [-5.1, -0.1, -0.5],
      type: 'skill',
      color: '#38BDF8',
      glowColor: '#38BDF8',
      size: 0.08,
      path: 'left',
      details: ['Object-Oriented Programming', 'Design patterns'],
    },
    {
      id: 'dsa-vit',
      label: 'Data Structures',
      position: [-5.9, -0.4, 0.1],
      type: 'skill',
      color: '#38BDF8',
      glowColor: '#38BDF8',
      size: 0.08,
      path: 'left',
      details: ['Arrays, Trees, Graphs', 'Algorithm implementation'],
    },
    {
      id: 'github-projects',
      label: 'GitHub Projects',
      position: [-4.6, -0.9, 0.6],
      type: 'skill',
      color: '#38BDF8',
      glowColor: '#38BDF8',
      size: 0.08,
      path: 'left',
      details: ['Open-source contributions', 'Project documentation'],
    },
    {
      id: 'software-dev',
      label: 'Software Dev',
      position: [-4.9, 1.3, -0.4],
      type: 'skill',
      color: '#38BDF8',
      glowColor: '#38BDF8',
      size: 0.08,
      path: 'left',
      details: ['Full development lifecycle', 'Version control'],
    },

    // ── RIGHT PATH — IIT MADRAS ───────────────────────────────────────────────
    {
      id: 'iit-madras',
      label: 'IIT Madras',
      sublabel: 'BS Data Science & Applications',
      position: [3.2, 0.5, 0],
      type: 'institution',
      color: '#3B82F6',
      glowColor: '#3B82F6',
      size: 0.16,
      path: 'right',
      description: 'Analytical rigor. Understanding data, statistics, and intelligence.',
      details: ['Data Science & Applications', 'Statistical Analysis', 'Machine Learning Foundations', 'Python Applications'],
      icon: 'BarChart2',
    },
    {
      id: 'statistics',
      label: 'Statistics',
      position: [5.6, 1.1, 0.5],
      type: 'skill',
      color: '#818CF8',
      glowColor: '#818CF8',
      size: 0.09,
      path: 'right',
      details: ['Descriptive & inferential stats', 'Probability theory'],
    },
    {
      id: 'data-analysis',
      label: 'Data Analysis',
      position: [5.1, -0.1, -0.5],
      type: 'skill',
      color: '#818CF8',
      glowColor: '#818CF8',
      size: 0.08,
      path: 'right',
      details: ['Exploratory data analysis', 'Data visualization'],
    },
    {
      id: 'ml-foundations',
      label: 'ML Foundations',
      position: [5.9, -0.4, 0.1],
      type: 'skill',
      color: '#818CF8',
      glowColor: '#818CF8',
      size: 0.08,
      path: 'right',
      details: ['Supervised learning', 'Model evaluation'],
    },
    {
      id: 'data-science',
      label: 'Data Science',
      position: [4.6, -0.9, 0.6],
      type: 'skill',
      color: '#818CF8',
      glowColor: '#818CF8',
      size: 0.08,
      path: 'right',
      details: ['Data pipelines', 'Insight extraction'],
    },
    {
      id: 'python-apps',
      label: 'Python Apps',
      position: [4.9, 1.3, -0.4],
      type: 'skill',
      color: '#818CF8',
      glowColor: '#818CF8',
      size: 0.08,
      path: 'right',
      details: ['pandas, numpy, sklearn', 'Real-world projects'],
    },

    // ── MERGED — CURRENT FOCUS ────────────────────────────────────────────────
    {
      id: 'current-focus',
      label: 'Current Focus',
      sublabel: 'Where both paths unite',
      position: [0, -3.2, 0],
      type: 'merged',
      color: '#C084FC',
      glowColor: '#C084FC',
      size: 0.18,
      path: 'center',
      description: 'Both journeys converging — building something larger than either path alone.',
      details: ['Web Development', 'Advanced C++', 'DSA', 'Data Science', 'Open Source Learning'],
      icon: 'Sparkles',
    },

    // Current focus sub-nodes
    {
      id: 'web-dev',
      label: 'Web Development',
      position: [-2.6, -4.3, 0.4],
      type: 'current',
      color: '#E879F9',
      glowColor: '#E879F9',
      size: 0.09,
      path: 'center',
      details: ['Next.js', 'React', 'TypeScript'],
    },
    {
      id: 'adv-cpp',
      label: 'Advanced C++',
      position: [-1.3, -4.9, -0.3],
      type: 'current',
      color: '#E879F9',
      glowColor: '#E879F9',
      size: 0.08,
      path: 'center',
      details: ['STL mastery', 'Memory management'],
    },
    {
      id: 'dsa-current',
      label: 'DSA',
      position: [0, -5.0, 0.5],
      type: 'current',
      color: '#E879F9',
      glowColor: '#E879F9',
      size: 0.08,
      path: 'center',
      details: ['Competitive programming', 'Problem solving'],
    },
    {
      id: 'ds-current',
      label: 'Data Science',
      position: [1.3, -4.9, -0.3],
      type: 'current',
      color: '#E879F9',
      glowColor: '#E879F9',
      size: 0.08,
      path: 'center',
      details: ['Applied ML', 'Data pipelines'],
    },
    {
      id: 'open-source',
      label: 'Open Source',
      position: [2.6, -4.3, 0.4],
      type: 'current',
      color: '#E879F9',
      glowColor: '#E879F9',
      size: 0.08,
      path: 'center',
      details: ['GitHub contributions', 'Community learning'],
    },
  ],

  // ─── CONNECTIONS ─────────────────────────────────────────────────────────────
  connections: [
    // DPS → Institutions (main animated paths)
    {
      id: 'dps-vit',
      from: 'dps-kvp',
      to: 'vit-bhopal',
      color: '#06B6D4',
      animated: true,
      flowSpeed: 0.45,
      particleCount: 12,
      tubeRadius: 0.009,
    },
    {
      id: 'dps-iit',
      from: 'dps-kvp',
      to: 'iit-madras',
      color: '#3B82F6',
      animated: true,
      flowSpeed: 0.45,
      particleCount: 12,
      tubeRadius: 0.009,
    },

    // VIT sub-connections (thin, not animated)
    { id: 'vit-cpp', from: 'vit-bhopal', to: 'cpp', color: '#38BDF8', animated: false, tubeRadius: 0.004 },
    { id: 'vit-oop', from: 'vit-bhopal', to: 'oop', color: '#38BDF8', animated: false, tubeRadius: 0.004 },
    { id: 'vit-dsa', from: 'vit-bhopal', to: 'dsa-vit', color: '#38BDF8', animated: false, tubeRadius: 0.004 },
    { id: 'vit-github', from: 'vit-bhopal', to: 'github-projects', color: '#38BDF8', animated: false, tubeRadius: 0.004 },
    { id: 'vit-sw', from: 'vit-bhopal', to: 'software-dev', color: '#38BDF8', animated: false, tubeRadius: 0.004 },

    // IIT sub-connections
    { id: 'iit-stats', from: 'iit-madras', to: 'statistics', color: '#818CF8', animated: false, tubeRadius: 0.004 },
    { id: 'iit-da', from: 'iit-madras', to: 'data-analysis', color: '#818CF8', animated: false, tubeRadius: 0.004 },
    { id: 'iit-ml', from: 'iit-madras', to: 'ml-foundations', color: '#818CF8', animated: false, tubeRadius: 0.004 },
    { id: 'iit-ds', from: 'iit-madras', to: 'data-science', color: '#818CF8', animated: false, tubeRadius: 0.004 },
    { id: 'iit-py', from: 'iit-madras', to: 'python-apps', color: '#818CF8', animated: false, tubeRadius: 0.004 },

    // Institutions → Current Focus (converging animated paths)
    {
      id: 'vit-current',
      from: 'vit-bhopal',
      to: 'current-focus',
      color: '#8B5CF6',
      animated: true,
      flowSpeed: 0.38,
      particleCount: 10,
      tubeRadius: 0.008,
    },
    {
      id: 'iit-current',
      from: 'iit-madras',
      to: 'current-focus',
      color: '#8B5CF6',
      animated: true,
      flowSpeed: 0.38,
      particleCount: 10,
      tubeRadius: 0.008,
    },

    // Current focus sub-connections
    { id: 'cur-web', from: 'current-focus', to: 'web-dev', color: '#E879F9', animated: false, tubeRadius: 0.004 },
    { id: 'cur-cpp', from: 'current-focus', to: 'adv-cpp', color: '#E879F9', animated: false, tubeRadius: 0.004 },
    { id: 'cur-dsa', from: 'current-focus', to: 'dsa-current', color: '#E879F9', animated: false, tubeRadius: 0.004 },
    { id: 'cur-ds', from: 'current-focus', to: 'ds-current', color: '#E879F9', animated: false, tubeRadius: 0.004 },
    { id: 'cur-os', from: 'current-focus', to: 'open-source', color: '#E879F9', animated: false, tubeRadius: 0.004 },
  ],
}

/** Color map used for path glow matching */
export const PATH_COLORS = {
  left: '#06B6D4',
  right: '#3B82F6',
  center: '#8B5CF6',
  current: '#E879F9',
} as const
