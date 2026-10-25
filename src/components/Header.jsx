import { memo, useState } from 'react'
import { Home, Layers, Shield, Route, Map, Lock, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: '首頁', href: '#top', icon: Home },
  { label: '10 層架構', href: '#layers', icon: Layers },
  { label: '5T 治理', href: '#governance', icon: Shield },
  { label: '客戶旅程', href: '#journey', icon: Route },
  { label: '實作路徑', href: '#roadmap', icon: Map },
  { label: '安全總覽', href: '#security', icon: Lock },
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/90 dark:bg-ink/90 backdrop-blur-md border-b border-ink/5 dark:border-cream/5">
      <div className="max-w-site mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-heading font-bold text-lg text-ink dark:text-cream flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-coral/50 rounded-full px-2 -ml-2">
          <span className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center text-sm">S</span>
          <span className="hidden sm:inline">SSAS</span>
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="頁面導覽">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold text-muted dark:text-cream/70 hover:text-coral hover:bg-red-100 dark:hover:bg-coral/20 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-coral/50"
              >
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-cream dark:bg-ink/60 text-ink dark:text-cream border border-ink/10 dark:border-cream/10 focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? '關閉選單' : '開啟選單'}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden absolute top-full left-0 right-0 bg-cream dark:bg-ink border-b border-ink/5 dark:border-cream/5 px-4 py-4 shadow-card"
          aria-label="行動版頁面導覽"
        >
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-ink dark:text-cream hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default memo(Header)
