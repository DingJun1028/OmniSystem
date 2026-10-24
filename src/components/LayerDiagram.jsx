import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function LayerDiagram({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null)

  const ringSize = 72
  const centerSize = 96

  return (
    <section id="layers" className="section">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">10 層同心圓架構</h2>
        <p className="text-muted text-lg">點擊任一層，查看職責、元件、Schema 與 5T 實現</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
        <div
          className="relative flex items-center justify-center"
          style={{ width: ringSize * 10 + centerSize, height: ringSize * 10 + centerSize, minWidth: ringSize * 10 + centerSize }}
        >
          {[...layers].reverse().map((layer) => {
            const index = layer.id
            const size = centerSize + ringSize * (index + 1)
            const isActive = selected === layer.id
            const isHovered = hovered === layer.id
            const Icon = iconMap[layer.icon]

            return (
              <motion.button
                key={layer.id}
                onClick={() => onSelect(layer.id)}
                onMouseEnter={() => setHovered(layer.id)}
                onMouseLeave={() => setHovered(null)}
                className={`absolute rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                  isActive ? 'border-coral z-20' : 'border-white/80 z-10'
                } ${layer.color}`}
                style={{
                  width: size,
                  height: size,
                }}
                animate={{
                  scale: isHovered || isActive ? 1.03 : 1,
                  opacity: hovered !== null && hovered !== layer.id && selected !== layer.id ? 0.55 : 1,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-white px-2">
                  <Icon size={index >= 5 ? 28 : 22} strokeWidth={2.5} />
                  <span className={`font-bold mt-1 ${index >= 5 ? 'text-base' : 'text-xs'}`}>
                    L{layer.id}
                  </span>
                  <span className={`text-center leading-tight ${index >= 5 ? 'text-sm' : 'text-[10px]'} hidden sm:block`}>
                    {layer.name.slice(2)}
                  </span>
                </div>
              </motion.button>
            )
          })}

          <motion.div
            className="absolute rounded-full bg-ink text-cream flex flex-col items-center justify-center z-30 shadow-card"
            style={{ width: centerSize, height: centerSize }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-coral">Core</span>
            <span className="text-sm font-heading font-bold text-center px-2">用戶需求</span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="card border-2 border-coral/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${layers[selected].color}`}>
                    {(() => {
                      const Icon = iconMap[layers[selected].icon]
                      return <Icon size={20} />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
