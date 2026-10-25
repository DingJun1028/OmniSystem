import { memo, useState } from 'react'
import IntentInput from './IntentInput'
import PipelineRunner from './PipelineRunner'
import ResultDashboard from './ResultDashboard'
import SessionHistory from './SessionHistory'

function WorkspacePage() {
  const [intentText, setIntentText] = useState('')
  const [latestSession, setLatestSession] = useState(null)

  return (
    <div className="min-h-screen bg-cream dark:bg-ink transition-colors">
      <IntentInput onSubmit={setIntentText} disabled={!!intentText} />
      <PipelineRunner intentText={intentText} onComplete={setLatestSession} />
      <ResultDashboard session={latestSession} />
      <SessionHistory onSelect={setLatestSession} />
    </div>
  )
}

export default memo(WorkspacePage)
