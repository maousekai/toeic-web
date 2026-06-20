'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type View =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'grammar'; slug?: string }
  | { name: 'vocab' }
  | { name: 'strategies'; slug?: string }
  | { name: 'practice' }
  | { name: 'test'; testSetId: string }
  | { name: 'results'; attemptId: string }
  | { name: 'tutor' }
  | { name: 'tools' }
  | { name: 'dashboard' }

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

// Anonymous learner id stored in localStorage
export function getLearnerId(): string {
  if (typeof window === 'undefined') return 'guest'
  let id = localStorage.getItem('toeic_learner_id')
  if (!id) {
    id = 'l_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('toeic_learner_id', id)
  }
  return id
}
