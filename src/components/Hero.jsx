import { memo } from 'react'
import { Sparkles, ArrowDown } from 'lucide-react'
import { ssasMeta } from '../data/ssasData'

function Hero() {
  return (
    <section className="section pt-10 md:pt-20 text-center relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-coral/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute top-10 -right-20 w-80 h-80 bg-sky/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-mint/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto animate-fade-in-up">
        <div className="inline-flex items-center gap-2 chip bg-red-100 dark:bg-coral/20 text-coral mb-6">
          <Sparkles size={16} aria-hidden="true" />
          <span>{ssasMeta.version} · {ssasMeta.date} · {ssasMeta.foundation}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-cream mb-4 leading-tight">
          {ssasMeta.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted dark:text-cream/70 font-bold mb-6">
          {ssasMeta.subtitle}
        </p>
        <p className="text-base sm:text-lg md:text-xl text-ink/90 dark:text-cream/80 leading-relaxed mb-8">
          {ssasMeta.philosophy}
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10" role="list" aria-label="5T 治理原則">
          {ssasMeta.fiveT.map((t) => (
            <span
              key={t.key}
              className={`chip ${t.color} ${t.textOnColor}`}
              role="listitem"
            >
              {t.key}
            </span>
          ))}
        </div>
        <a href="#layers" className="btn-primary">
          探索 10 層架構
          <ArrowDown size={20} aria-hidden="true" />
        </a>
      </div>

      <div className="relative mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-left animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {ssasMeta.principles.map((p, i) => (
          <div key={i} className="card border-2 border-coral/10 dark:border-coral/20 hover:border-coral/30 transition-colors">
            <h3 className="text-lg md:text-xl text-ink dark:text-cream mb-2">{p.name}</h3>
            <p className="text-muted dark:text-cream/70 leading-relaxed text-sm md:text-base">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(Hero)
