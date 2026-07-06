'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type View =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'grammar'; slug?: string }
  | { name: 'vocab' }
  | { name: 'pronunciation' }
  | { name: 'strategies'; slug?: string }
  | { name: 'practice' }
  | { name: 'test'; testSetId: string; mode?: 'practice' | 'exam' }
  | { name: 'results'; attemptId: string }
  | { name: 'tutor' }
  | { name: 'tools' }
  | { name: 'dashboard' }
  | { name: 'admin' }

type RouterCtx = {
  view: View
  navigate: (v: View) => void
}

const Ctx = createContext<RouterCtx | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ name: 'home' })

  const navigate = useCallback((v: View) => {
    setView(v)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return <Ctx.Provider value={{ view, navigate }}>{children}</Ctx.Provider>
}

export function useRouter() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}

// Anonymous learner id stored in localStorage.
// When a userId is provided (authenticated user), use a deterministic id so
// attempts follow the account across devices.
export function getLearnerId(userId?: string): string {
  if (userId) return `learner_${userId}`
  if (typeof window === 'undefined') return 'guest'
  let id = localStorage.getItem('toeic_learner_id')
  if (!id) {
    id = 'l_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('toeic_learner_id', id)
  }
  return id
}
