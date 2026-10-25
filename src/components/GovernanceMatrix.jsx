import { memo } from 'react'
import { governanceMatrix, ssasMeta, layers } from '../data/ssasData'

function GovernanceMatrix() {
  return (
    <section id="governance" className="section">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">5T 治理矩陣</h2>
        <p className="text-muted text-lg">每一層都滿足 Traceable / Trackable / Tangible / Transparent / Trustworthy</p>
      </div>

      <div className="overflow-x-auto rounded-3xl shadow-card bg-white">
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
                className="border-b border-ink/5 hover:bg-cream/50 transition-colors"
              >
                <th scope="row" className="px-4 py-4 font-bold text-ink text-left">
                  L{row.layer} · {layers[row.layer].name}
                </th>
                {ssasMeta.fiveT.map((t) => (
                  <td key={t.key} className="px-4 py-4 text-center">
                    <span className={`inline-block px-3 py-2 rounded-xl ${t.tint} text-ink/90 font-medium`}>
                      {row[t.key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default memo(GovernanceMatrix)
