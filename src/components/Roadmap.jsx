import { memo } from 'react'
import { Flag, Calendar, Folder } from 'lucide-react'
import { roadmap } from '../data/ssasData'

function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">實作路徑</h2>
        <p className="text-muted text-lg">五週落地計畫、優先級矩陣與元件對應表</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="card border-2 border-coral/10">
          <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Flag size={24} className="text-coral" aria-hidden="true" />
            優先級定義
          </h3>
          <div className="space-y-4">
            {roadmap.priorities.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-cream rounded-2xl p-4 animate-fade-in-left"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`chip text-xs shrink-0 ${p.priority === 'P0' ? 'bg-coral text-white' : p.priority === 'P1' ? 'bg-sunshine text-ink' : 'bg-mint text-ink'}`}>
                  {p.priority}
                </span>
                <div>
                  <h4 className="font-bold text-ink">{p.item}</h4>
                  <p className="text-muted text-sm">{p.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                    <span>資源：{p.resources}</span>
                    <span>責任人：{p.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-2 border-coral/10">
          <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Calendar size={24} className="text-coral" aria-hidden="true" />
            目標與週期
          </h3>
          <div className="space-y-4">
            {roadmap.phases.map((p, i) => (
              <div
                key={i}
                className="relative pl-6 border-l-4 border-coral/30 animate-fade-in-right"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h4 className="font-bold text-ink">{p.week}：{p.goal}</h4>
                <p className="text-muted text-sm mt-1">{p.kpi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-2 border-coral/10">
        <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
          <Folder size={24} className="text-coral" aria-hidden="true" />
          元件對應表
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-ink text-cream">
                <th scope="col" className="px-4 py-3 text-left rounded-tl-2xl">元件</th>
                <th scope="col" className="px-4 py-3 text-left">負責組別</th>
                <th scope="col" className="px-4 py-3 text-left rounded-tr-2xl">代碼路徑</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.componentMapping.map((c, i) => (
                <tr
                  key={i}
                  className="border-b border-ink/5 hover:bg-cream/50"
                >
                  <td className="px-4 py-3 font-bold text-ink">{c.component}</td>
                  <td className="px-4 py-3 text-muted">{c.team}</td>
                  <td className="px-4 py-3 text-ink/90 font-mono">{c.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default memo(Roadmap)
