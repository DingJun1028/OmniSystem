import { memo, useState, useMemo } from 'react'
import { Target, Radar, Database, Brain, ShieldCheck, GitBranch, Hammer, Globe, LayoutDashboard, RefreshCw } from 'lucide-react'
import { layers } from '../data/ssasData'

const iconMap = {
  Target,
  Radar,
  Database,
  Brain,
  ShieldCheck,
  GitBranch,
  Hammer,
  Globe,
  LayoutDashboard,
  RefreshCw,
}

function LayerDiagram({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null)

  const ringSize = 56
  const centerSize = 88
  const maxDiameter = centerSize + ringSize * 10

  const selectedLayer = selected !== null ? layers[selected] : null

  const mobileList = useMemo(() => (
    <div className="lg:hidden w-full space-y-3">
      {layers.map((layer) => {
        const Icon = iconMap[layer.icon]
        const isActive = selected === layer.id
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onSelect(layer.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              isActive
                ? 'border-coral bg-red-50 dark:bg-coral/10'
                : 'border-transparent bg-white dark:bg-ink/40 shadow-card'
            }`}
          >
            <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${layer.color} ${layer.textOnColor}`}>
              <Icon size={22} aria-hidden="true" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${layer.text}`}>L{layer.id}</span>
                <h3 className="font-bold text-ink dark:text-cream truncate">{layer.name}</h3>
              </div>
              <p className="text-sm text-muted dark:text-cream/60 truncate">{layer.subtitle}</p>
            </div>
          </button>
        )
      })}
    </div>
  ), [selected, onSelect])

  return (
    <section className="section">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-3">10 層同心圓架構</h2>
        <p className="text-muted dark:text-cream/70 text-base sm:text-lg">點擊任一層，查看職責、元件、Schema 與 5T 實現</p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-8 lg:gap-10">
        <div className="hidden lg:flex relative items-center justify-center mx-auto">
          <div
            className="relative"
            style={{ width: maxDiameter, height: maxDiameter, minWidth: maxDiameter }}
            role="radiogroup"
            aria-label="選擇 SSAS 層級"
          >
            {[...layers].reverse().map((layer) => {
              const index = layer.id
              const size = centerSize + ringSize * (index + 1)
              const isActive = selected === layer.id
              const isHovered = hovered === layer.id
              const Icon = iconMap[layer.icon]

              return (
                <button
                  key={layer.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`第 ${layer.id} 層：${layer.name}`}
                  onClick={() => onSelect(layer.id)}
                  onMouseEnter={() => setHovered(layer.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(layer.id)}
                  onBlur={() => setHovered(null)}
                  className={`absolute rounded-full border-4 transition-all duration-300 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-coral/50 ${
                    isActive ? 'border-coral z-20' : 'border-white/80 dark:border-ink/60 z-10'
                  } ${layer.color}`}
                  style={{
                    width: size,
                    height: size,
                    top: (maxDiameter - size) / 2,
                    left: (maxDiameter - size) / 2,
                    transform: isHovered || isActive ? 'scale(1.03)' : 'scale(1)',
                    opacity: hovered !== null && hovered !== layer.id && selected !== layer.id ? 0.55 : 1,
                  }}
                >
                  <div className={`flex flex-col items-center px-2 ${layer.textOnColor}`}>
                    <Icon size={index >= 5 ? 26 : 20} strokeWidth={2.5} aria-hidden="true" />
                    <span className={`font-bold mt-1 ${index >= 5 ? 'text-base' : 'text-xs'}`}>
                      L{layer.id}
                    </span>
                    <span className={`text-center leading-tight ${index >= 5 ? 'text-sm' : 'text-[10px]'}`}>
                      {layer.name.slice(2)}
                    </span>
                  </div>
                </button>
              )
            })}

            <div
              className="absolute rounded-full bg-ink text-cream flex flex-col items-center justify-center z-30 shadow-card animate-pulse-slow"
              style={{ width: centerSize, height: centerSize, top: (maxDiameter - centerSize) / 2, left: (maxDiameter - centerSize) / 2 }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-coral">Core</span>
              <span className="text-sm font-heading font-bold text-center px-2">用戶需求</span>
            </div>
          </div>
        </div>

        {mobileList}

        {selectedLayer && (
          <div
            key={selected}
            className="w-full lg:max-w-md animate-fade-in-right"
          >
            <div className="card border-2 border-coral/10 dark:border-coral/20">
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedLayer.color} ${selectedLayer.textOnColor}`}>
                  {(() => {
                    const Icon = iconMap[selectedLayer.icon]
                    return <Icon size={20} aria-hidden="true" />
                  })()}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl text-ink dark:text-cream truncate">{selectedLayer.name}</h3>
                  <p className={`text-sm font-bold ${selectedLayer.text}`}>第 {selected} 層 · {selectedLayer.subtitle}</p>
                </div>
              </div>
              <p className="text-muted dark:text-cream/70 leading-relaxed mb-4 text-sm md:text-base">
                {selectedLayer.duty.join('；')}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(selectedLayer.fiveT).map((key) => (
                  <span key={key} className="chip bg-cream dark:bg-ink text-muted dark:text-cream/70 text-xs border border-ink/10 dark:border-cream/10">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(LayerDiagram)
