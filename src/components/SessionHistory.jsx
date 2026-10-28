import { memo } from 'react'
import { History, Trash2, Clock } from 'lucide-react'
import { useSSAS } from '../contexts/SSASContext'
import { layers } from '../data/ssasData'

function SessionHistory({ onSelect }) {
  const { sessions, deleteSession, currentSessionId, setCurrentSessionId } = useSSAS()

  if (sessions.length === 0) {
    return (
      <section className="section pt-0 pb-8">
        <div className="card border-2 border-dashed border-coral/20 text-center py-10">
          <History size={40} className="mx-auto text-coral/50 mb-3" aria-hidden="true" />
          <h3 className="text-lg text-ink dark:text-cream mb-1">還沒有執行紀錄</h3>
          <p className="text-sm text-muted dark:text-cream/70">在工作台輸入意圖後，這裡會顯示歷史紀錄。</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section pt-0 pb-10">
      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <h2 className="text-xl sm:text-2xl text-ink dark:text-cream mb-4 flex items-center gap-2">
          <History size={22} className="text-coral" aria-hidden="true" />
          執行歷史
        </h2>
        <div className="space-y-3">
          {sessions.map((s) => {
            const active = currentSessionId === s.id
            return (
              <div
                key={s.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
                  active
                    ? 'border-coral bg-red-50 dark:bg-coral/10'
                    : 'border-transparent bg-cream dark:bg-ink/40 hover:bg-red-50 dark:hover:bg-coral/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSessionId(s.id)
                    onSelect?.(s)
                  }}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-bold text-ink dark:text-cream truncate text-sm sm:text-base">{s.intent.core_goal}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted dark:text-cream/70">
                    <span className="flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" />
                      {new Date(s.createdAt).toLocaleString('zh-Hant')}
                    </span>
                    <span className={`chip text-xs ${s.finalStatus === 'success' ? 'bg-mint text-ink' : s.finalStatus === 'partial' ? 'bg-sunshine text-ink' : 'bg-coral text-white'}`}>
                      {s.finalStatus === 'success' ? '成功' : s.finalStatus === 'partial' ? '部分' : '失敗'}
                    </span>
                    <span className="chip bg-sky/15 text-sky-700 dark:text-sky-300 text-xs border border-sky/20">
                      {s.layers.length} / {layers.length} 層
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteSession(s.id)}
                  className="self-start sm:self-center p-2 rounded-full text-coral hover:bg-red-100 dark:hover:bg-coral/20 transition-colors"
                  aria-label="刪除紀錄"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default memo(SessionHistory)
