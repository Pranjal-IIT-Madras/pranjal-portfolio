/**
 * constants/education.ts
 * Single source of truth for all education data.
 * The defining characteristic: VIT and IIT run in parallel since 2023.
 */

export type EducationStatus = 'completed' | 'ongoing'

export interface EducationItem {
  id:          string
  institution: string
  shortName:   string
  degree:      string
  field:       string
  location:    string
  duration:    string
  startYear:   string
  endYear:     string | null
  status:      EducationStatus
  highlights:  string[]
  color:       string
  glowColor:   string
  description: string
  /** Displayed below card when two institutions run simultaneously */
  parallelNote?: string
}

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id:          'dps-kvp',
    institution: 'DPS KPV Greater Noida',
    shortName:   'DPS KPV',
    degree:      'Senior Secondary Education',
    field:       'Science Stream',
    location:    'Greater Noida, UP',
    duration:    'Completed',
    startYear:   '–',
    endYear:     '2022',
    status:      'completed',
    highlights:  ['Head Boy', 'Leadership', 'Public Speaking', 'Python', 'Event Management', 'Decision Making'],
    color:       '#E8D5A3',
    glowColor:   '#FFD580',
    description:
      'Foundation years. Academic excellence and student leadership shaped early problem-solving instincts. ' +
      'Serving as Head Boy built a sense of responsibility that still defines how I approach challenges.',
  },
  {
    id:          'vit-bhopal',
    institution: 'VIT Bhopal University',
    shortName:   'VIT Bhopal',
    degree:      'B.Tech Computer Science Engineering',
    field:       'Computer Science & Engineering',
    location:    'Bhopal, MP',
    duration:    '2023 – 2027',
    startYear:   '2023',
    endYear:     null,
    status:      'ongoing',
    highlights:  ['C++', 'OOP', 'Data Structures', 'Algorithms', 'Software Development', 'GitHub Projects'],
    color:       '#06B6D4',
    glowColor:   '#06B6D4',
    description:
      'Engineering depth. Building the technical foundation for software development — ' +
      'algorithms, systems thinking, and real project experience through hands-on coursework.',
    parallelNote: 'Running in parallel with IIT Madras',
  },
  {
    id:          'iit-madras',
    institution: 'IIT Madras',
    shortName:   'IIT Madras',
    degree:      'BS Data Science and Applications',
    field:       'Data Science & Applications',
    location:    'Chennai, TN (Online)',
    duration:    '2023 – 2027',
    startYear:   '2023',
    endYear:     null,
    status:      'ongoing',
    highlights:  ['Statistics', 'Data Analysis', 'Machine Learning Foundations', 'Python Applications', 'Probability Theory'],
    color:       '#3B82F6',
    glowColor:   '#3B82F6',
    description:
      'Analytical breadth. Statistical thinking, data science methodologies, and the mathematical ' +
      'foundations of machine intelligence — pursued simultaneously with engineering studies.',
    parallelNote: 'Running in parallel with VIT Bhopal',
  },
]

/** The two simultaneous institutions — used to render the "parallel" visual indicator */
export const PARALLEL_PAIR = ['vit-bhopal', 'iit-madras'] as const
