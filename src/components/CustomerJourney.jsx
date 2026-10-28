import { memo } from 'react'
import { User, ArrowRight } from 'lucide-react'
import { customerJourney, layers } from '../data/ssasData'

const darkTintMap = {
  'bg-red-100': 'dark:bg-red-900/30',
  'bg-amber-100': 'dark:bg-amber-900/30',
  'bg-emerald-100': 'dark:bg-emerald-900/30',
  'bg-sky-100': 'dark:bg-sky-900/30',
  'bg-purple-100': 'dark:bg-purple-900/30',
}

function CustomerJourney() {
  return (
    <section id="journey" className="section">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-3">客戶旅程映射</h2>
        <p className="text-muted dark:text-cream/70 text-base sm:text-lg">從探索需求到持續進化的完整閉環</p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-6 sm:left-8 md:left-12 top-0 bottom-0 w-1 bg-coral/20 rounded-full" />

        {customerJourney.map((step, i) => {
          const layer = layers[step.layer]
          return (
            <div
              key={i}
              className="relative flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8 last:mb-0 animate-fade-in-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shrink-0 ${layer.color} ${layer.textOnColor} shadow-card`}>
                <div className="text-center">
                  <span className="block text-[10px] sm:text-xs font-bold opacity-90">STEP</span>
                  <span className="block text-lg sm:text-xl md:text-2xl font-heading font-bold">{i + 1}</span>
                </div>
              </div>

              <div className="card flex-1 border-2 border-coral/10 dark:border-coral/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl text-ink dark:text-cream">{step.stage}</h3>
                  <span className={`chip ${layer.tint} ${darkTintMap[layer.tint]} ${layer.text} text-xs`}>
                    第 {step.layer} 層 · {layer.name}
                  </span>
                </div>
                <p className="text-muted dark:text-cream/70 text-sm sm:text-base">{step.goal}</p>
              </div>
            </div>
          )
        })}

        <div className="relative flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 animate-fade-in-right">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-ink text-cream flex items-center justify-center shrink-0 shadow-card">
            <User size={24} className="sm:w-8 sm:h-8" aria-hidden="true" />
          </div>
          <div className="card flex-1 border-2 border-coral/10 dark:border-coral/20 flex items-center gap-3">
            <ArrowRight size={20} className="text-coral shrink-0" aria-hidden="true" />
            <span className="text-base sm:text-lg font-bold text-ink dark:text-cream">回到第 0 層，形成閉環迭代</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(CustomerJourney)
