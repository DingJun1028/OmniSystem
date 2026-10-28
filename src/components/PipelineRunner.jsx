import { memo, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { runSSASPipeline, getLayerName, getLayerColor, getLayerText } from '../engine/ssasEngine'
import { useSSAS } from '../contexts/SSASContext'

const statusIcon = {
  completed: <CheckCircle size={18} className="text-mint" aria-hidden="true" />,
  partial: <AlertCircle size={18} className="text-sunshine" aria-hidden="true" />,
  blocked: <AlertCircle size={18} className="text-coral" aria-hidden="true" />,
  pending: <Loader2 size={18} className="text-sky animate-spin" aria-hidden="true" />,
}

function PipelineRunner({ intentText, onComplete }) {
  const { addSession, addMemory } = useSSAS()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!intentText) return
    setRunning(true)
    setProgress([])
    setResult(null)
    setError(null)

    runSSASPipeline({ intentText }, (update) => {
      setProgress((prev) => {
        const next = [...prev]
        const idx = next.findIndex((p) => p.layerId === update.layerId)
        if (idx >= 0) next[idx] = update
        else next.push(update)
        return next.sort((a, b) => a.layerId - b.layerId)
      })
    })
      .then((session) => {
        setResult(session)
        addSession(session)
        addMemory({
          memory_id: `mem-${session.id}`,
          memory_type: 'case',
          content: session.intent.core_goal,
          tags: extractTags(session.intent.business_intent),
          confidence: 0.9,
          created_at: Date.now(),
          created_by: 'ssas-engine',
          source_origin: session.id,
          lifespan: 90,
          retrievable: true,
        })
        onComplete?.(session)
      })
      .catch((err) => setError(err.message))
      .finally(() => setRunning(false))
  }, [intentText, addSession, addMemory, onComplete])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [progress])

  if (!intentText && !result) return null

  return (
    <section className="section pt-0 pb-8">
      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl text-ink dark:text-cream flex items-center gap-2">
            <Play size={22} className="text-coral" aria-hidden="true" />
            執行進度
          </h2>
          {result && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-cream dark:bg-ink/40 text-ink dark:text-cream hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
            >
              <RotateCcw size={16} aria-hidden="true" />
              再跑一次
            </button>
          )}
        </div>

        <div ref={scrollRef} className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {progress.map((p) => (
            <div
              key={p.layerId}
              className="flex items-center gap-3 p-3 rounded-2xl bg-cream dark:bg-ink/40 animate-fade-in-right"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getLayerColor(p.layerId)} ${p.layerId === 1 || p.layerId === 6 ? 'text-ink' : 'text-white'}`}>
                L{p.layerId}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink dark:text-cream text-sm sm:text-base truncate">{getLayerName(p.layerId)}</span>
                  <span className={`text-xs font-bold ${getLayerText(p.layerId)}`}>{p.duration}ms</span>
                </div>
                <p className="text-xs sm:text-sm text-muted dark:text-cream/70 truncate">
                  {p.status === 'blocked' ? '治理閘門未通過' : p.status === 'partial' ? '部分完成' : '已完成'}
                </p>
              </div>
              {statusIcon[p.status] || statusIcon.pending}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 text-coral text-sm">
            執行失敗：{error}
          </div>
        )}

        {running && (
          <div className="mt-4 flex items-center gap-2 text-muted dark:text-cream/70 text-sm">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            SSAS 引擎正在處理中...
          </div>
        )}
      </div>
    </section>
  )
}

function extractTags(text) {
  const common = ['目標', '提升', '優化', '建立', '設計', '分析', '自動化', '整合', '客戶', '產品']
  return common.filter((t) => text.includes(t))
}

export default memo(PipelineRunner)
