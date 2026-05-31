export const PERSONAL = {
  name: 'Pranjal Bhatnagar',
  initials: 'PB',
  title: 'Computer Science Student',
  bio: `Navigating dual academic journeys at VIT Bhopal and IIT Madras — building expertise in software engineering, data science, and algorithms while turning academic knowledge into real projects.`,

  /** Text that rotates in the Hero section */
  roles: [
    'Computer Science Student',
    'B.Tech CSE · VIT Bhopal',
    'BS Data Science · IIT Madras',
    'Developer',
    'Problem Solver',
    'Technology Enthusiast',
    'Lifelong Learner',
  ],

  contact: {
    email: 'pranjalb@student.example.com',
    github: 'https://github.com/Pranjal-Bhatnagar',
    linkedin: 'https://linkedin.com/in/pranjal-bhatnagar',
  },

  /** Keywords used in metadata / SEO */
  keywords: [
    'Computer Science Student',
    'VIT Bhopal',
    'IIT Madras',
    'Data Science',
    'Software Development',
    'C++',
    'Python',
    'Web Development',
    'Machine Learning',
  ],
} as const

export const IDENTITY_TAGS = [
  'Computer Science Student',
  'Problem Solver',
  'Technology Enthusiast',
  'Developer',
  'Lifelong Learner',
] as const

export const QUICK_STATS = [
  { label: 'Universities', value: '2', suffix: '' },
  { label: 'Certifications', value: '6', suffix: '+' },
  { label: 'Projects', value: '5', suffix: '+' },
  { label: 'Learning', value: '∞', suffix: '' },
] as const
