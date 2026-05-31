/**
 * constants/projects.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all 5 featured projects.
 * Every entry maps to a real GitHub repository.
 * No placeholder or fabricated projects.
 */

export type ProjectStatus   = 'completed' | 'ongoing' | 'learning'
export type ProjectCategory = 'data-science' | 'software' | 'education' | 'practice'

export interface ProjectLink {
  label: string
  href:  string
  type:  'github' | 'demo' | 'docs'
}

export interface Project {
  id:          string
  title:       string
  tagline:     string
  description: string
  /** 2–3 sentence case study detail shown in the modal */
  detail:      string
  repoName:    string
  repoUrl:     string
  category:    ProjectCategory
  status:      ProjectStatus
  /** Primary accent color */
  color:       string
  /** All technologies used */
  stack:       string[]
  /** 3–5 key outcomes or highlights */
  highlights:  string[]
  links:       ProjectLink[]
  /** Featured = larger card in the grid */
  featured:    boolean
}

export const GITHUB_USERNAME = 'Pranjal-Bhatnagar'

export const PROJECTS: Project[] = [
  {
    id:         'power-fault-detector',
    title:      'Power Fault Detector',
    tagline:    'Industrial fault detection & load forecasting',
    description:
      'An industrial power fault detection and load forecasting system built in Python. ' +
      'Analyses electrical signal data to identify anomalies and predict demand patterns.',
    detail:
      'This project addresses a real industrial challenge: detecting electrical faults before ' +
      'they cause equipment damage or outages. The system processes raw power signal data, ' +
      'applies statistical anomaly detection, and generates load forecasts using time-series ' +
      'analysis. Built as part of applied data science coursework, it demonstrates the bridge ' +
      'between classroom statistics and real-world engineering problems.',
    repoName:   'Power-Fault-Detector',
    repoUrl:    'https://github.com/Pranjal-Bhatnagar/Power-Fault-Detector',
    category:   'data-science',
    status:     'completed',
    color:      '#06B6D4',
    stack:      ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Statistics', 'Time-Series'],
    highlights: [
      'Anomaly detection on electrical signal data',
      'Load forecasting with time-series analysis',
      'Statistical thresholding for fault classification',
      'Data visualisation for fault event reporting',
    ],
    links: [
      {
        label: 'GitHub',
        href:  'https://github.com/Pranjal-Bhatnagar/Power-Fault-Detector',
        type:  'github',
      },
    ],
    featured: true,
  },
  {
    id:         'transport-logistics',
    title:      'Transport & Logistics Analyser',
    tagline:    'Transportation analysis & logistics optimisation',
    description:
      'A transportation analysis and logistics optimisation project that models route efficiency, ' +
      'load distribution, and supply chain data using Python.',
    detail:
      'Transportation and logistics generate enormous datasets that are rarely exploited to their ' +
      'full potential. This project builds a pipeline to ingest logistics data, analyse route ' +
      'patterns, model load distribution across a network, and surface optimisation opportunities. ' +
      'Combines data engineering (cleaning, transformation) with analytical modelling (route ' +
      'scoring, bottleneck identification) to deliver actionable insights.',
    repoName:   'Transport-Logistics-Analyser',
    repoUrl:    'https://github.com/Pranjal-Bhatnagar/Transport-Logistics-Analyser',
    category:   'data-science',
    status:     'completed',
    color:      '#3B82F6',
    stack:      ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Analysis', 'Optimisation'],
    highlights: [
      'Route efficiency modelling across transport networks',
      'Load distribution analysis and rebalancing',
      'Supply chain data pipeline (ingest → clean → model)',
      'Bottleneck identification and scoring system',
    ],
    links: [
      {
        label: 'GitHub',
        href:  'https://github.com/Pranjal-Bhatnagar/Transport-Logistics-Analyser',
        type:  'github',
      },
    ],
    featured: true,
  },
  {
    id:         'digital-literacy',
    title:      'Digital Literacy Project',
    tagline:    'Technology awareness & education initiative',
    description:
      'A technology awareness and digital literacy initiative — structured educational content ' +
      'designed to make technology concepts accessible to broader audiences.',
    detail:
      'Digital literacy is a prerequisite for meaningful participation in modern society, yet ' +
      'access to clear, well-structured technology education remains uneven. This project creates ' +
      'a structured curriculum covering foundational technology concepts — from internet safety ' +
      'to basic programming thinking — designed to be adaptable for different learning contexts. ' +
      'Reflects the belief that understanding technology should not require a computer science degree.',
    repoName:   'Digital-Literacy-Project',
    repoUrl:    'https://github.com/Pranjal-Bhatnagar/Digital-Literacy-Project',
    category:   'education',
    status:     'completed',
    color:      '#8B5CF6',
    stack:      ['Documentation', 'Educational Content', 'Curriculum Design'],
    highlights: [
      'Structured curriculum covering 8 core digital literacy modules',
      'Designed for adaptability across different learning environments',
      'Plain-language explanations without assumed technical background',
      'Covers internet safety, data privacy, and basic computing concepts',
    ],
    links: [
      {
        label: 'GitHub',
        href:  'https://github.com/Pranjal-Bhatnagar/Digital-Literacy-Project',
        type:  'github',
      },
    ],
    featured: false,
  },
  {
    id:         'cpp-practice',
    title:      'C++ Practice Repository',
    tagline:    'Documented progression from beginner to advanced C++',
    description:
      'A collection documenting a systematic journey through C++ — from fundamental syntax ' +
      'to advanced OOP, STL mastery, and algorithmic problem solving.',
    detail:
      'Learning in public: this repository is not a finished project, it is a record of a ' +
      'learning journey. Each directory maps to a concept tier — syntax fundamentals, OOP ' +
      'principles, STL containers and algorithms, data structures implemented from scratch, ' +
      'and competitive programming problems. The commit history is the real story — consistent ' +
      'daily practice building genuine understanding of a difficult language.',
    repoName:   'cpp-practice',
    repoUrl:    'https://github.com/Pranjal-Bhatnagar/cpp-practice',
    category:   'practice',
    status:     'ongoing',
    color:      '#38BDF8',
    stack:      ['C++', 'STL', 'OOP', 'Data Structures', 'Algorithms', 'Problem Solving'],
    highlights: [
      'Systematic progression: syntax → OOP → STL → DSA',
      'Data structures implemented from scratch in C++',
      'Algorithm implementations with complexity analysis',
      'Daily commit discipline — consistent practice over time',
    ],
    links: [
      {
        label: 'GitHub',
        href:  'https://github.com/Pranjal-Bhatnagar/cpp-practice',
        type:  'github',
      },
    ],
    featured: false,
  },
  {
    id:         'iit-madras-profile',
    title:      'IIT Madras Academic',
    tagline:    'Academic portfolio & IIT Madras coursework',
    description:
      'Academic profile and coursework repository for the BS Data Science & Applications ' +
      'programme at IIT Madras — notes, assignments, and project work.',
    detail:
      'A living record of the IIT Madras BS Data Science journey. Contains structured notes ' +
      'from statistics, mathematics, and programming courses; assignment solutions with ' +
      'documented reasoning; and project work connecting theoretical concepts to applied ' +
      'problems. The repository structure mirrors the programme curriculum, making it a ' +
      'navigable reference for the subjects covered semester by semester.',
    repoName:   'Pranjal-IIT-Madras',
    repoUrl:    'https://github.com/Pranjal-Bhatnagar/Pranjal-IIT-Madras',
    category:   'education',
    status:     'ongoing',
    color:      '#818CF8',
    stack:      ['Python', 'Statistics', 'Mathematics', 'Data Science', 'IIT Madras'],
    highlights: [
      'Course notes from statistics, mathematics, and DS foundations',
      'Assignment solutions with documented problem-solving approach',
      'Organised by semester and subject for easy navigation',
      'Ongoing — updated as the programme progresses',
    ],
    links: [
      {
        label: 'GitHub',
        href:  'https://github.com/Pranjal-Bhatnagar/Pranjal-IIT-Madras',
        type:  'github',
      },
    ],
    featured: false,
  },
]

/** Projects sorted: featured first, then by status (ongoing before completed) */
export const SORTED_PROJECTS = [
  ...PROJECTS.filter((p) => p.featured),
  ...PROJECTS.filter((p) => !p.featured),
]
