import { memo } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? '切換淺色模式' : '切換深色模式'}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cream dark:bg-ink/60 text-ink dark:text-cream border border-ink/10 dark:border-cream/10 hover:bg-red-100 dark:hover:bg-coral/20 transition-colors focus-visible:ring-2 focus-visible:ring-coral/50"
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}

export default memo(ThemeToggle)
