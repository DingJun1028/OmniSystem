import { memo } from 'react'
import { governanceMatrix, ssasMeta, layers } from '../data/ssasData'

const darkTintMap = {
  'bg-red-100': 'dark:bg-red-900/30',
  'bg-amber-100': 'dark:bg-amber-900/30',
  'bg-emerald-100': 'dark:bg-emerald-900/30',
  'bg-sky-100': 'dark:bg-sky-900/30',
  'bg-purple-100': 'dark:bg-purple-900/30',
}

function GovernanceMatrix() {
  return (
    <section id="governance" className="section">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-3">5T 治理矩陣</h2>
        <p className="text-muted dark:text-cream/70 text-base sm:text-lg">每一層都滿足 Traceable / Trackable / Tangible / Transparent / Trustworthy</p>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-3xl shadow-card bg-white dark:bg-ink/60">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-ink text-cream">
              <th scope="col" className="px-4 py-4 text-left rounded-tl-3xl">層級</th>
              {ssasMeta.fiveT.map((t) => (
                <th key={t.key} scope="col" className="px-4 py-4 text-center">
                  <span className={`inline-block chip ${t.color} ${t.textOnColor}`}>{t.key}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {governanceMatrix.map((row) => (
              <tr
                key={row.layer}
                className="border-b border-ink/5 dark:border-cream/5 hover:bg-cream/50 dark:hover:bg-cream/10 transition-colors"
              >
                <th scope="row" className="px-4 py-4 font-bold text-ink dark:text-cream text-left">
                  L{row.layer} · {layers[row.layer].name}
                </th>
                {ssasMeta.fiveT.map((t) => (
                  <td key={t.key} className="px-4 py-4 text-center">
                    <span className={`inline-block px-3 py-2 rounded-xl ${t.tint} ${darkTintMap[t.tint]} text-ink/90 dark:text-cream/90 font-medium`}>
                      {row[t.key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {governanceMatrix.map((row) => (
          <div key={row.layer} className="card border-2 border-coral/10 dark:border-coral/20">
            <h3 className="font-bold text-ink dark:text-cream mb-3">
              L{row.layer} · {layers[row.layer].name}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {ssasMeta.fiveT.map((t) => (
                <div key={t.key} className={`flex items-center justify-between rounded-xl px-3 py-2 ${t.tint} ${darkTintMap[t.tint]}`}>
                  <span className={`text-xs font-bold ${t.text}`}>{t.key}</span>
                  <span className="text-sm text-ink/90 dark:text-cream/90 text-right max-w-[70%]">{row[t.key]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(GovernanceMatrix)
