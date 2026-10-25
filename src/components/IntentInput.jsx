import { memo, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

function IntentInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSubmit(text.trim())
    setText('')
  }

  return (
    <section className="section pt-8 pb-4">
      <div className="card border-2 border-coral/10 dark:border-coral/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={22} className="text-coral" aria-hidden="true" />
          <h2 className="text-xl sm:text-2xl text-ink dark:text-cream">輸入你的意圖</h2>
        </div>
        <p className="text-muted dark:text-cream/70 mb-4 text-sm sm:text-base">
          描述你想達成的目標、痛點或 KPI，SSAS 會依序跑過 10 層流程並產出結果。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例如：我想在三個月內把網站載入速度提升 50%，KPI：Lighthouse 分數達到 90"
            className="flex-1 h-12 px-4 rounded-2xl border-2 border-coral/40 bg-white text-ink placeholder:text-muted focus:outline-none focus:border-coral focus:ring-4 focus:ring-coral/20 transition-all text-sm sm:text-base"
            disabled={disabled}
            aria-label="意圖輸入"
          />
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {disabled ? '執行中...' : '開始執行'}
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default memo(IntentInput)
