import { memo } from 'react'
import { Home, Layers, Shield, Route, Map, Lock } from 'lucide-react'

const navItems = [
  { label: '首頁', href: '#top', icon: Home },
  { label: '10 層架構', href: '#layers', icon: Layers },
  { label: '5T 治理', href: '#governance', icon: Shield },
  { label: '客戶旅程', href: '#journey', icon: Route },
  { label: '實作路徑', href: '#roadmap', icon: Map },
  { label: '安全總覽', href: '#security', icon: Lock },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink/5">
      <nav className="max-w-site mx-auto px-4 md:px-6 h-16 flex items-center gap-2 overflow-x-auto no-scrollbar" aria-label="頁面導覽">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold text-muted hover:text-coral hover:bg-red-100 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-coral/50"
            >
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </header>
  )
}

export default memo(Header)
