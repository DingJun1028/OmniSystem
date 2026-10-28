import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Cpu, Settings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: '首頁', href: '/', icon: Home },
  { label: '工作台', href: '/workspace', icon: Cpu },
  { label: '設定', href: '/settings', icon: Settings },
]

function WorkspaceHeader() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-cream/90 dark:bg-ink/90 backdrop-blur-md border-b border-ink/5 dark:border-cream/5">
      <div className="max-w-site mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-lg text-ink dark:text-cream flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-coral/50 rounded-full px-2 -ml-2">
          <span className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center text-sm">S</span>
          <span className="hidden sm:inline">SSAS</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="應用程式導航">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-coral/50 ${
                  active
                    ? 'bg-coral text-white'
                    : 'text-muted dark:text-cream/70 hover:text-coral hover:bg-red-100 dark:hover:bg-coral/20'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}

export default memo(WorkspaceHeader)
