export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  totalCommits: number
  followers: number
  following: number
  contributions: number
  streak: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  size: number
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionWeek {
  days: ContributionDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

export interface LanguageStat {
  name: string
  bytes: number
  percentage: number
  color: string
}
