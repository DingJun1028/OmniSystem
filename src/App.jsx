import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SSASProvider } from './contexts/SSASContext'
import WorkspaceHeader from './components/WorkspaceHeader'
import LoadingSection from './components/LoadingSection'

const LandingPage = lazy(() => import('./components/LandingPage'))
const WorkspacePage = lazy(() => import('./components/WorkspacePage'))
const SettingsPage = lazy(() => import('./components/SettingsPage'))

function App() {
  return (
    <SSASProvider>
      <BrowserRouter>
        <main className="min-h-screen bg-cream dark:bg-ink transition-colors">
          <WorkspaceHeader />
          <Suspense fallback={<LoadingSection />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </SSASProvider>
  )
}

export default App
