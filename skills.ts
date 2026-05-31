/**
 * constants/skills.ts
 * All skill data. Levels represent honest self-assessment of current
 * proficiency — not aspirational targets.
 *
 * Do NOT use boring progress bars. This data feeds the circular
 * SVG ring visualization in SkillOrb.
 */

export type SkillStatus = 'active' | 'learning'

export interface Skill {
  name:        string
  /** 0-100 proficiency estimate */
  level:       number
  description: string
  status:      SkillStatus
}

export interface SkillCategory {
  id:         string
  label:      string
  shortLabel: string
  /** Tailwind/CSS color string for accent + glow */
  color:      string
  skills:     Skill[]
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id:         'programming',
    label:      'Programming Languages',
    shortLabel: 'Languages',
    color:      '#06B6D4',
    skills: [
      {
        name:        'C++',
        level:       82,
        description: 'OOP, STL, competitive programming foundations',
        status:      'active',
      },
      {
        name:        'Python',
        level:       80,
        description: 'Scripting, data analysis, automation tasks',
        status:      'active',
      },
      {
        name:        'HTML',
        level:       72,
        description: 'Semantic markup, accessibility-aware HTML5',
        status:      'active',
      },
      {
        name:        'SQL',
        level:       65,
        description: 'Relational queries, joins, data manipulation',
        status:      'active',
      },
    ],
  },
  {
    id:         'tools',
    label:      'Tools & Platforms',
    shortLabel: 'Tools',
    color:      '#3B82F6',
    skills: [
      {
        name:        'VS Code',
        level:       88,
        description: 'Primary development environment, extensions',
        status:      'active',
      },
      {
        name:        'GitHub',
        level:       80,
        description: 'Repo management, open source, collaboration',
        status:      'active',
      },
      {
        name:        'Git',
        level:       76,
        description: 'Version control, branching, merging workflows',
        status:      'active',
      },
    ],
  },
  {
    id:         'concepts',
    label:      'CS Fundamentals',
    shortLabel: 'Concepts',
    color:      '#8B5CF6',
    skills: [
      {
        name:        'OOP',
        level:       78,
        description: 'Encapsulation, inheritance, polymorphism',
        status:      'active',
      },
      {
        name:        'DSA',
        level:       72,
        description: 'Arrays, trees, graphs, hash maps, heaps',
        status:      'active',
      },
      {
        name:        'Problem Solving',
        level:       76,
        description: 'Analytical debugging, algorithmic thinking',
        status:      'active',
      },
      {
        name:        'Algorithms',
        level:       68,
        description: 'Sorting, searching, dynamic programming',
        status:      'active',
      },
    ],
  },
  {
    id:         'data-science',
    label:      'Data Science',
    shortLabel: 'Data Science',
    color:      '#818CF8',
    skills: [
      {
        name:        'Statistics',
        level:       70,
        description: 'Descriptive, inferential, probability theory',
        status:      'active',
      },
      {
        name:        'Data Analysis',
        level:       65,
        description: 'EDA, pandas, numpy, visualisation',
        status:      'active',
      },
      {
        name:        'ML Foundations',
        level:       58,
        description: 'Supervised learning, model evaluation basics',
        status:      'active',
      },
    ],
  },
  {
    id:         'exploring',
    label:      'Currently Exploring',
    shortLabel: 'Exploring',
    color:      '#E879F9',
    skills: [
      {
        name:        'Web Dev',
        level:       44,
        description: 'React, Next.js, TypeScript — actively building',
        status:      'learning',
      },
      {
        name:        'Adv. C++',
        level:       48,
        description: 'Templates, smart pointers, advanced STL',
        status:      'learning',
      },
      {
        name:        'Unreal Engine',
        level:       20,
        description: 'Engine fundamentals, Blueprints, visual scripting',
        status:      'learning',
      },
    ],
  },
]
