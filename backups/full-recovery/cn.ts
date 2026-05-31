import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — class name merger.
 * Combines clsx conditional logic with tailwind-merge deduplication.
 * Used everywhere to safely compose Tailwind class strings.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
