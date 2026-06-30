import { createContext, useContext, type ReactNode } from 'react'

type SessionGateContextValue = {
  logout: () => void
  logoutAndResetLoading: () => void
}

const SessionGateContext = createContext<SessionGateContextValue | null>(null)

export function SessionGateProvider({
  children,
  logout,
  logoutAndResetLoading,
}: {
  children: ReactNode
  logout: () => void
  logoutAndResetLoading: () => void
}) {
  return (
    <SessionGateContext.Provider value={{ logout, logoutAndResetLoading }}>
      {children}
    </SessionGateContext.Provider>
  )
}

export function useSessionGate(): SessionGateContextValue {
  const context = useContext(SessionGateContext)
  if (!context) {
    throw new Error('useSessionGate must be used within SessionGateProvider')
  }
  return context
}
