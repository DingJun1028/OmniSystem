import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'ssas-sessions-v1'
const MEMORY_KEY = 'ssas-memory-v1'
const SETTINGS_KEY = 'ssas-settings-v1'

const SSASContext = createContext(null)

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadMemory() {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { aiEnabled: false, aiProvider: 'groq', aiModel: 'qwen-3-32b', aiKey: '' }
  } catch {
    return { aiEnabled: false, aiProvider: 'groq', aiModel: 'qwen-3-32b', aiKey: '' }
  }
}

export function SSASProvider({ children }) {
  const [sessions, setSessions] = useState(() => loadSessions())
  const [memory, setMemory] = useState(() => loadMemory())
  const [settings, setSettings] = useState(() => loadSettings())
  const [currentSessionId, setCurrentSessionId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
  }, [memory])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const addSession = useCallback((session) => {
    setSessions((prev) => [session, ...prev])
    setCurrentSessionId(session.id)
  }, [])

  const updateSession = useCallback((id, updater) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? (typeof updater === 'function' ? updater(s) : { ...s, ...updater }) : s)))
  }, [])

  const deleteSession = useCallback((id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (currentSessionId === id) setCurrentSessionId(null)
  }, [currentSessionId])

  const addMemory = useCallback((entry) => {
    setMemory((prev) => [entry, ...prev])
  }, [])

  const deleteMemory = useCallback((id) => {
    setMemory((prev) => prev.filter((m) => m.memory_id !== id))
  }, [])

  const updateSettings = useCallback((next) => {
    setSettings((prev) => ({ ...prev, ...next }))
  }, [])

  const exportData = useCallback(() => {
    return JSON.stringify({ sessions, memory, settings, exportedAt: Date.now() }, null, 2)
  }, [sessions, memory, settings])

  const importData = useCallback((json) => {
    const data = JSON.parse(json)
    if (data.sessions) setSessions(data.sessions)
    if (data.memory) setMemory(data.memory)
    if (data.settings) setSettings(data.settings)
  }, [])

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null

  return (
    <SSASContext.Provider
      value={{
        sessions,
        memory,
        settings,
        currentSession,
        currentSessionId,
        setCurrentSessionId,
        addSession,
        updateSession,
        deleteSession,
        addMemory,
        deleteMemory,
        updateSettings,
        exportData,
        importData,
      }}
    >
      {children}
    </SSASContext.Provider>
  )
}

export function useSSAS() {
  const ctx = useContext(SSASContext)
  if (!ctx) throw new Error('useSSAS must be used within SSASProvider')
  return ctx
}
