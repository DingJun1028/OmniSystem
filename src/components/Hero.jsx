import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'
import { ssasMeta } from '../data/ssasData'

export default function Hero() {
  return (
    <section className="section pt-20 md:pt-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 chip bg-red-100 text-coral mb-6">
          <Sparkles size={16} />
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
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {ssasMeta.fiveT.map((t) => (
            <span
              key={t.key}
              className={`chip ${t.color} text-white`}
            >
              {t.key}
            </span>
          ))}
        </div>
        <a href="#layers" className="btn-primary">
          探索 10 層架構
          <ArrowDown size={20} />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left"
      >
        {ssasMeta.principles.map((p, i) => (
          <div key={i} className="card border-2 border-coral/10 hover:border-coral/30 transition-colors">
            <h3 className="text-xl text-ink mb-2">{p.name}</h3>
            <p className="text-muted leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
