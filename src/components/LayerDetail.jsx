import { memo } from 'react'
import { Code, Layers, Shield, CheckCircle } from 'lucide-react'
import { layers, ssasMeta } from '../data/ssasData'

function LayerDetail({ selected }) {
  if (selected === null) return null

  const layer = layers[selected]

  return (
    <section className="section pt-0">
      <div className="card border-2 border-coral/10">
        <div className="flex items-center gap-3 mb-6">
          <span className={`w-12 h-12 rounded-full flex items-center justify-center ${layer.color} ${layer.textOnColor}`}>
            <span className="font-heading font-bold text-lg">L{layer.id}</span>
          </span>
          <div>
            <h2 className="text-3xl text-ink">{layer.name}</h2>
            <p className="text-muted">{layer.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl text-ink mb-4 flex items-center gap-2">
              <Layers size={22} className="text-coral" aria-hidden="true" />
              核心職責
            </h3>
            <ul className="space-y-3 mb-8">
              {layer.duty.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-ink/90">
                  <CheckCircle size={18} className="text-mint mt-1 shrink-0" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl text-ink mb-4 flex items-center gap-2">
              <Shield size={22} className="text-coral" aria-hidden="true" />
              5T 治理實現
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ssasMeta.fiveT.map((t) => (
                <div key={t.key} className={`rounded-2xl p-4 ${t.tint}`}>
                  <span className={`text-sm font-bold ${t.text}`}>{t.key}</span>
                  <p className="text-sm text-ink/80 mt-1">{layer.fiveT[t.key]}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl text-ink mb-4">核心元件</h3>
            <div className="space-y-3 mb-8">
              {layer.components.map((c, i) => (
                <div key={i} className="flex items-start gap-3 bg-cream rounded-2xl p-4">
                  <span className="font-bold text-coral text-sm shrink-0">{c.name}</span>
                  <span className="text-muted text-sm">{c.desc}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl text-ink mb-4 flex items-center gap-2">
              <Code size={22} className="text-coral" aria-hidden="true" />
              關鍵數據形狀
            </h3>
            <pre className="code-block mb-6">
              <code>{layer.schema}</code>
            </pre>

            <h3 className="text-xl text-ink mb-4">關鍵實現</h3>
            <pre className="code-block">
              <code>{layer.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(LayerDetail)
