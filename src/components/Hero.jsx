import { memo } from 'react'
import { Sparkles, ArrowDown } from 'lucide-react'
import { ssasMeta } from '../data/ssasData'

function Hero() {
  return (
    <section className="section pt-12 md:pt-20 text-center">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="inline-flex items-center gap-2 chip bg-red-100 text-coral mb-6">
          <Sparkles size={16} aria-hidden="true" />
          <span>{ssasMeta.version} · {ssasMeta.date} · {ssasMeta.foundation}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink mb-4 leading-tight">
          {ssasMeta.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted font-bold mb-6">
          {ssasMeta.subtitle}
        </p>
        <p className="text-lg md:text-xl text-ink/90 leading-relaxed mb-8">
          {ssasMeta.philosophy}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10" role="list" aria-label="5T 治理原則">
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

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {ssasMeta.principles.map((p, i) => (
          <div key={i} className="card border-2 border-coral/10 hover:border-coral/30 transition-colors">
            <h3 className="text-xl text-ink mb-2">{p.name}</h3>
            <p className="text-muted leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(Hero)
