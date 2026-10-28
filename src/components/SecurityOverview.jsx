import { memo } from 'react'
import { Shield, Lock, FileJson } from 'lucide-react'
import { securityGates, securityStrategies, layers, serializationSchema } from '../data/ssasData'

function SecurityOverview() {
  return (
    <section id="security" className="section">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink dark:text-cream mb-3">安全與治理總覽</h2>
        <p className="text-muted dark:text-cream/70 text-base sm:text-lg">10 道 5T 閘門、關鍵安全策略與序列化數據形狀</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
        <div className="lg:col-span-2 card border-2 border-coral/10 dark:border-coral/20">
          <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
            <Shield size={24} className="text-coral shrink-0" aria-hidden="true" />
            5T 閘門總覽
          </h3>
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-ink text-cream">
                  <th scope="col" className="px-4 py-3 text-left rounded-tl-2xl">閘門</th>
                  <th scope="col" className="px-4 py-3 text-left">位置</th>
                  <th scope="col" className="px-4 py-3 text-left">驗證內容</th>
                  <th scope="col" className="px-4 py-3 text-left rounded-tr-2xl">通過標準</th>
                </tr>
              </thead>
              <tbody>
                {securityGates.map((g, i) => (
                  <tr
                    key={i}
                    className="border-b border-ink/5 dark:border-cream/5 hover:bg-cream/50 dark:hover:bg-cream/10"
                  >
                    <td className="px-4 py-3 font-bold text-ink dark:text-cream">{g.gate}</td>
                    <td className="px-4 py-3 text-muted dark:text-cream/70">第 {g.layer} 層 · {layers[g.layer].name}</td>
                    <td className="px-4 py-3 text-ink/90 dark:text-cream/90">{g.check}</td>
                    <td className="px-4 py-3 text-ink/90 dark:text-cream/90">{g.standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border-2 border-coral/10 dark:border-coral/20">
          <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
            <Lock size={24} className="text-coral shrink-0" aria-hidden="true" />
            關鍵安全策略
          </h3>
          <div className="space-y-4">
            {securityStrategies.map((s, i) => (
              <div
                key={i}
                className="bg-cream dark:bg-ink/40 rounded-2xl p-4 animate-fade-in-right"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <h4 className="font-bold text-ink dark:text-cream mb-1 text-sm sm:text-base">{s.name}</h4>
                <p className="text-muted dark:text-cream/70 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <h3 className="text-xl sm:text-2xl text-ink dark:text-cream mb-6 flex items-center gap-2">
          <FileJson size={24} className="text-coral shrink-0" aria-hidden="true" />
          序列化數據形狀
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-ink dark:text-cream mb-3">整體流程序列化</h4>
            <pre className="code-block">
              <code>{serializationSchema.pipeline}</code>
            </pre>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-ink dark:text-cream mb-3">統一結果格式</h4>
            <pre className="code-block">
              <code>{serializationSchema.unified}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(SecurityOverview)
