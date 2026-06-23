'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name!,
        email: session.user.email!,
        image: session.user.image ?? null,
      }
    : null

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login: (email: string, password: string) =>
      signIn('credentials', { email, password, redirect: false }),
    logout: () => signOut({ redirect: false }),
  }
}

// Returns the learnerId to use for saving attempts.
// - When logged in: a deterministic id derived from the user id (so attempts follow the account)
// - When anonymous: a localStorage-generated id (existing behavior)
export function getLearnerIdForUser(userId: string | undefined): string {
  if (userId) return `learner_${userId}`
  // fallback to anonymous local id
  if (typeof window === 'undefined') return 'guest'
  let id = localStorage.getItem('toeic_learner_id')
  if (!id) {
    id = 'l_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('toeic_learner_id', id)
  }
  return id
}
