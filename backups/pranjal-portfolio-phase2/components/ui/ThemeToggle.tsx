'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useCursor } from '@/components/cursor/CursorContext'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { enterButton, leaveAll } = useCursor()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={enterButton}
      onMouseLeave={leaveAll}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative flex items-center justify-center',
        'w-9 h-9 rounded-full',
        'bg-white/5 hover:bg-white/10',
        'border border-white/10 hover:border-[var(--cyan)]/40',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)]',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1   }}
          exit={{    opacity: 0, rotate:  30,  scale: 0.7 }}
          transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={15} className="text-[var(--cyan)]" />
          ) : (
            <Sun  size={15} className="text-yellow-400" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
