import { memo } from 'react'
import { User, ArrowRight } from 'lucide-react'
import { customerJourney, layers } from '../data/ssasData'

function CustomerJourney() {
  return (
    <section id="journey" className="section">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">客戶旅程映射</h2>
        <p className="text-muted text-lg">從探索需求到持續進化的完整閉環</p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-coral/20 rounded-full" />

        {customerJourney.map((step, i) => {
          const layer = layers[step.layer]
          return (
            <div
              key={i}
              className="relative flex items-start gap-6 mb-8 last:mb-0 animate-fade-in-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shrink-0 ${layer.color} ${layer.textOnColor} shadow-card`}>
                <div className="text-center">
                  <span className="block text-xs font-bold opacity-90">STEP</span>
                  <span className="block text-xl md:text-2xl font-heading font-bold">{i + 1}</span>
                </div>
              </div>

              <div className="card flex-1 border-2 border-coral/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="text-xl text-ink">{step.stage}</h3>
                  <span className={`chip ${layer.tint} ${layer.text} text-xs`}>
                    第 {step.layer} 層 · {layer.name}
                  </span>
                </div>
                <p className="text-muted">{step.goal}</p>
              </div>
            </div>
          )
        })}

        <div className="relative flex items-center gap-6 mt-8 animate-fade-in-right">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-ink text-cream flex items-center justify-center shrink-0 shadow-card">
            <User size={32} aria-hidden="true" />
          </div>
          <div className="card flex-1 border-2 border-coral/10 flex items-center gap-3">
            <ArrowRight size={24} className="text-coral" aria-hidden="true" />
            <span className="text-lg font-bold text-ink">回到第 0 層，形成閉環迭代</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(CustomerJourney)
