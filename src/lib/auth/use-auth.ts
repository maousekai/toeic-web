'use client'

import { useMemo } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const userId = session?.user?.id
  const userName = session?.user?.name
  const userEmail = session?.user?.email
  const userImage = session?.user?.image
  const userRole = (session?.user as any)?.role

  const user = useMemo(() => {
    if (!userId) return null
    return {
      id: userId,
      name: userName!,
      email: userEmail!,
      image: userImage ?? null,
      role: userRole || 'STUDENT',
    }
  }, [userId, userName, userEmail, userImage, userRole])

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
