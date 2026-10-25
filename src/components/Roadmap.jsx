import { memo } from 'react'
import { Flag, Calendar, Folder } from 'lucide-react'
import { roadmap } from '../data/ssasData'

function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-3">實作路徑</h2>
        <p className="text-muted dark:text-cream/70 text-base sm:text-lg">五週落地計畫、優先級矩陣與元件對應表</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
        <div className="card border-2 border-coral/10 dark:border-coral/20">
          <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
            <Flag size={24} className="text-coral shrink-0" aria-hidden="true" />
            優先級定義
          </h3>
          <div className="space-y-4">
            {roadmap.priorities.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 sm:gap-4 bg-cream dark:bg-ink/40 rounded-2xl p-4 animate-fade-in-left"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`chip text-xs shrink-0 ${p.priority === 'P0' ? 'bg-coral text-white' : p.priority === 'P1' ? 'bg-sunshine text-ink' : 'bg-mint text-ink'}`}>
                  {p.priority}
                </span>
                <div className="min-w-0">
                  <h4 className="font-bold text-ink dark:text-cream text-sm sm:text-base">{p.item}</h4>
                  <p className="text-muted dark:text-cream/70 text-sm">{p.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted dark:text-cream/60">
                    <span>資源：{p.resources}</span>
                    <span>負責人：{p.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-2 border-coral/10 dark:border-coral/20">
          <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
            <Calendar size={24} className="text-coral shrink-0" aria-hidden="true" />
            目標與週期
          </h3>
          <div className="space-y-4">
            {roadmap.phases.map((p, i) => (
              <div
                key={i}
                className="relative pl-6 sm:pl-8 border-l-4 border-coral/30 animate-fade-in-right"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h4 className="font-bold text-ink dark:text-cream text-sm sm:text-base">{p.week}：{p.goal}</h4>
                <p className="text-muted dark:text-cream/70 text-sm mt-1">{p.kpi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
          <Folder size={24} className="text-coral shrink-0" aria-hidden="true" />
          元件對應表
        </h3>
        <div className="overflow-x-auto rounded-2xl">
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
                  className="border-b border-ink/5 dark:border-cream/5 hover:bg-cream/50 dark:hover:bg-cream/10"
                >
                  <td className="px-4 py-3 font-bold text-ink dark:text-cream">{c.component}</td>
                  <td className="px-4 py-3 text-muted dark:text-cream/70">{c.team}</td>
                  <td className="px-4 py-3 text-ink/90 dark:text-cream/90 font-mono">{c.path}</td>
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
