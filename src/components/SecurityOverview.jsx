import { motion } from 'framer-motion'
import { Shield, Lock, FileJson } from 'lucide-react'
import { securityGates, securityStrategies, layers, serializationSchema } from '../data/ssasData'

export default function SecurityOverview() {
  return (
    <section id="security" className="section">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-ink mb-3">安全與治理總覽</h2>
        <p className="text-muted text-lg">10 道 5T 閘門、關鍵安全策略與系列化數據形狀</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 card border-2 border-coral/10">
          <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Shield size={24} className="text-coral" />
            5T 閘門總覽
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 text-left rounded-tl-2xl">閘門</th>
                  <th className="px-4 py-3 text-left">位置</th>
                  <th className="px-4 py-3 text-left">驗證內容</th>
                  <th className="px-4 py-3 text-left rounded-tr-2xl">通過標準</th>
                </tr>
              </thead>
              <tbody>
                {securityGates.map((g, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-ink/5 hover:bg-cream/50"
                  >
                    <td className="px-4 py-3 font-bold text-ink">{g.gate}</td>
                    <td className="px-4 py-3 text-muted">第 {g.layer} 層 · {layers[g.layer].name}</td>
                    <td className="px-4 py-3 text-ink/90">{g.check}</td>
                    <td className="px-4 py-3 text-ink/90">{g.standard}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border-2 border-coral/10">
          <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Lock size={24} className="text-coral" />
            關鍵安全策略
          </h3>
          <div className="space-y-4">
            {securityStrategies.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-cream rounded-2xl p-4"
              >
                <h4 className="font-bold text-ink mb-1">{s.name}</h4>
                <p className="text-muted text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-2 border-coral/10">
        <h3 className="text-2xl text-ink mb-6 flex items-center gap-2">
          <FileJson size={24} className="text-coral" />
          系列化數據形狀
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-ink mb-3">整體流程序列化</h4>
            <pre className="code-block">
              <code>{serializationSchema.pipeline}</code>
            </pre>
          </div>
          <div>
            <h4 className="text-lg font-bold text-ink mb-3">統一結果格式</h4>
            <pre className="code-block">
              <code>{serializationSchema.unified}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
