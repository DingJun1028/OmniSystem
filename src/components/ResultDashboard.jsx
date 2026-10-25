import { memo, useState } from 'react'
import { BarChart3, GitBranch, ShieldCheck, Globe, RefreshCw, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { layers } from '../data/ssasData'

function ResultDashboard({ session }) {
  const [open, setOpen] = useState({})

  if (!session) return null

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ssas-session-${session.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const layerResult = (id) => session.layers.find((l) => l.layerId === id)
  const intent = session.intent
  const dag = session.dag
  const execution = session.execution
  const dashboard = session.dashboard
  const evolution = session.evolution

  return (
    <section className="section pt-0 pb-10">
      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl text-ink dark:text-cream flex items-center gap-2">
            <BarChart3 size={22} className="text-coral" aria-hidden="true" />
            執行結果儀表板
          </h2>
          <button
            type="button"
            onClick={downloadJSON}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-coral text-white font-bold text-sm hover:bg-coral-dark transition-colors"
          >
            <Download size={16} aria-hidden="true" />
            匯出 JSON
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard label="最終狀態" value={session.finalStatus === 'success' ? '成功' : session.finalStatus === 'partial' ? '部分成功' : '失敗'} color={session.finalStatus === 'success' ? 'text-mint' : session.finalStatus === 'partial' ? 'text-sunshine' : 'text-coral'} />
          <MetricCard label="總耗時" value={`${session.layers.reduce((sum, l) => sum + (l.duration || 0), 0)}ms`} color="text-sky" />
          <MetricCard label="任務數" value={dag?.nodes?.length || 0} color="text-lilac" />
          <MetricCard label="記憶引用" value={layerResult(2)?.output?.length || 0} color="text-coral" />
        </div>

        <div className="space-y-3">
          <Accordion open={open.intent} onToggle={() => toggle('intent')} title="L0 意圖規格" icon={layers[0].icon}>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(intent, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.strategy} onToggle={() => toggle('strategy')} title="L3 推理策略" icon={layers[3].icon}>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(layerResult(3)?.output, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.governance} onToggle={() => toggle('governance')} title="L4 治理閘門" icon={layers[4].icon}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className={layerResult(4)?.status === 'completed' ? 'text-mint' : 'text-coral'} aria-hidden="true" />
              <span className="font-bold text-ink dark:text-cream">
                {layerResult(4)?.status === 'completed' ? '已通過治理閘門' : '未通過治理閘門'}
              </span>
            </div>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(layerResult(4)?.output, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.dag} onToggle={() => toggle('dag')} title="L5 任務 DAG" icon={layers[5].icon}>
            <div className="flex flex-wrap gap-2 mb-3">
              {dag?.nodes?.map((n) => (
                <span key={n.node_id} className="chip bg-sky/15 text-sky-700 dark:text-sky-300 text-xs border border-sky/20">
                  {n.task}
                </span>
              ))}
            </div>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(dag, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.execution} onToggle={() => toggle('execution')} title="L6 執行結果" icon={layers[6].icon}>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(execution, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.integration} onToggle={() => toggle('integration')} title="L7 外部整合" icon={layers[7].icon}>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={18} className="text-mint" aria-hidden="true" />
              <span className="text-sm text-ink dark:text-cream">成功模擬 {layerResult(7)?.output?.length || 0} 個外部呼叫</span>
            </div>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(layerResult(7)?.output, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.dashboard} onToggle={() => toggle('dashboard')} title="L8 體驗門戶" icon={layers[8].icon}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {dashboard?.metrics?.map((m) => (
                <div key={m.metric_id} className="rounded-2xl p-3 bg-cream dark:bg-ink/40 text-center">
                  <div className="text-xs text-muted dark:text-cream/70 mb-1">{m.name}</div>
                  <div className="text-lg font-bold text-ink dark:text-cream">{m.value}{m.unit}</div>
                </div>
              ))}
            </div>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(dashboard, null, 2)}</code>
            </pre>
          </Accordion>

          <Accordion open={open.evolution} onToggle={() => toggle('evolution')} title="L9 演化建議" icon={layers[9].icon}>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw size={18} className="text-lilac" aria-hidden="true" />
              <span className="text-sm text-ink dark:text-cream">模型版本：{evolution?.model_version}</span>
            </div>
            <ul className="space-y-2 mb-3">
              {evolution?.next_actions?.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/90 dark:text-cream/80">
                  <span className="w-5 h-5 rounded-full bg-lilac/20 text-lilac flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ul>
            <pre className="code-block text-xs">
              <code>{JSON.stringify(evolution, null, 2)}</code>
            </pre>
          </Accordion>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value, color }) {
  return (
    <div className="rounded-2xl p-4 bg-cream dark:bg-ink/40 text-center">
      <div className="text-xs text-muted dark:text-cream/70 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

function Accordion({ open, onToggle, title, icon, children }) {
  const Icon = icon
  return (
    <div className="rounded-2xl border border-ink/10 dark:border-cream/10 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-cream dark:bg-ink/40 hover:bg-red-50 dark:hover:bg-coral/10 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-bold text-ink dark:text-cream flex items-center gap-2">
          {Icon && <Icon size={18} className="text-coral" aria-hidden="true" />}
          {title}
        </span>
        {open ? <ChevronUp size={18} className="text-muted" aria-hidden="true" /> : <ChevronDown size={18} className="text-muted" aria-hidden="true" />}
      </button>
      {open && <div className="p-4 bg-white dark:bg-ink/60">{children}</div>}
    </div>
  )
}

export default memo(ResultDashboard)
