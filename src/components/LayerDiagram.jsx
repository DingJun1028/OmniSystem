import { memo, useState } from 'react'
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

  return (
    <section className="section">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">10 層同心圓架構</h2>
        <p className="text-muted text-lg">點擊任一層，查看職責、元件、Schema 與 5T 實現</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        <div
          className="relative flex items-center justify-center mx-auto"
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
                  isActive ? 'border-coral z-20' : 'border-white/80 z-10'
                } ${layer.color}`}
                style={{
                  width: size,
                  height: size,
                  transform: isHovered || isActive ? 'scale(1.03)' : 'scale(1)',
                  opacity: hovered !== null && hovered !== layer.id && selected !== layer.id ? 0.55 : 1,
                }}
              >
                <div className={`flex flex-col items-center px-2 ${layer.textOnColor}`}>
                  <Icon size={index >= 5 ? 26 : 20} strokeWidth={2.5} aria-hidden="true" />
                  <span className={`font-bold mt-1 ${index >= 5 ? 'text-base' : 'text-xs'}`}>
                    L{layer.id}
                  </span>
                  <span className={`text-center leading-tight ${index >= 5 ? 'text-sm' : 'text-[10px]'} hidden sm:block`}>
                    {layer.name.slice(2)}
                  </span>
                </div>
              </button>
            )
          })}

          <div
            className="absolute rounded-full bg-ink text-cream flex flex-col items-center justify-center z-30 shadow-card animate-pulse-slow"
            style={{ width: centerSize, height: centerSize }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-coral">Core</span>
            <span className="text-sm font-heading font-bold text-center px-2">用戶需求</span>
          </div>
        </div>

        {selected !== null && (
          <div
            key={selected}
            className="w-full max-w-md animate-fade-in-right"
          >
            <div className="card border-2 border-coral/10">
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${layers[selected].color} ${layers[selected].textOnColor}`}>
                  {(() => {
                    const Icon = iconMap[layers[selected].icon]
                    return <Icon size={20} aria-hidden="true" />
                  })()}
                </span>
                <div>
                  <h3 className="text-2xl text-ink">{layers[selected].name}</h3>
                  <p className={`text-sm font-bold ${layers[selected].text}`}>第 {selected} 層 · {layers[selected].subtitle}</p>
                </div>
              </div>
              <p className="text-muted leading-relaxed mb-4">
                {layers[selected].duty.join('；')}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(layers[selected].fiveT).map((key) => (
                  <span key={key} className="chip bg-cream text-muted text-xs border border-ink/10">
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
