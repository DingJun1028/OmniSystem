import { memo, useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { layers } from '../data/ssasData'

function LayerSearch({ onSelect }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return layers.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.duty.some((d) => d.toLowerCase().includes(q)) ||
        l.components.some((c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    )
  }, [query])

  const handleSelect = (id) => {
    onSelect(id)
    setQuery('')
    const el = document.getElementById('layers')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative w-full max-w-md mx-auto mb-10">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋層級、職責或元件…"
          className="w-full h-12 pl-11 pr-10 rounded-2xl border-2 border-coral/40 bg-white text-ink placeholder:text-muted focus:outline-none focus:border-coral focus:ring-4 focus:ring-coral/20 transition-all"
          aria-label="搜尋 SSAS 層級"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cream text-muted"
            aria-label="清除搜尋"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {query && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-card border border-ink/5 overflow-hidden z-40">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted">
              找不到符合「{query}」的層級
            </div>
          ) : (
            <ul role="listbox" aria-label="搜尋結果">
              {results.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(l.id)}
                    className="w-full text-left px-4 py-3 hover:bg-cream transition-colors flex items-center gap-3"
                    role="option"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${l.color} ${l.textOnColor}`}>
                      L{l.id}
                    </span>
                    <span className="font-bold text-ink">{l.name}</span>
                    <span className="text-muted text-sm ml-auto">{l.subtitle}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(LayerSearch)
