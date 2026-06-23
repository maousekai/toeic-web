'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AuthModal } from '@/components/auth/auth-modal'

type AuthMode = 'login' | 'register'

type AuthUIContextType = {
  openAuth: (mode?: AuthMode, onSuccess?: () => void) => void
  closeAuth: () => void
}

const AuthUIContext = createContext<AuthUIContextType | null>(null)

export function AuthUIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('login')
  const [onSuccessCb, setOnSuccessCb] = useState<(() => void) | undefined>(undefined)

  const openAuth = useCallback((m: AuthMode = 'login', onSuccess?: () => void) => {
    setMode(m)
    setOnSuccessCb(() => onSuccess)
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => setOpen(false), [])

  return (
    <AuthUIContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        defaultMode={mode}
        onSuccess={onSuccessCb}
      />
    </AuthUIContext.Provider>
  )
}

export function useAuthUI() {
  const ctx = useContext(AuthUIContext)
  if (!ctx) throw new Error('useAuthUI must be used within AuthUIProvider')
  return ctx
}
