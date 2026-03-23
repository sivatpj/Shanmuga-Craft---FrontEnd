import { createContext, useContext } from 'react'
import { useSSE } from '../hooks/useSSE'

const SSEContext = createContext(null)

export function SSEProvider({ children }) {
  const sse = useSSE()
  return <SSEContext.Provider value={sse}>{children}</SSEContext.Provider>
}

export function useSSEContext() {
  const ctx = useContext(SSEContext)
  if (!ctx) throw new Error('useSSEContext must be used within SSEProvider')
  return ctx
}
