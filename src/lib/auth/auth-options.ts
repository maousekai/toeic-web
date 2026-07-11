import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  // JWT-based session works best with SQLite and serverless/edge environments
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.')
        }
        const email = credentials.email.toLowerCase().trim()
        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
          throw new Error('No account found with that email. Please register first.')
        }
        if (user.locked) {
          // Thrown message is not propagated to the client by NextAuth v4 —
          // the login modal does a pre-check against /api/auth/check-status
          // to surface a friendly "account locked" message.
          throw new Error('ACCOUNT_LOCKED')
        }
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) {
          throw new Error('Incorrect password. Please try again.')
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? null,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email!
        token.name = user.name!
        token.role = (user as any).role || 'STUDENT'
      }
      // Always fetch latest role from DB on subsequent token uses
      if (token.email && !token.role) {
        const dbUser = await db.user.findUnique({ where: { email: token.email }, select: { role: true } })
        token.role = dbUser?.role || 'STUDENT'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
  pages: {
    // We use a modal-based UI, but keep the sign-in/error page paths for fallback.
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'toeic-ace-ai-dev-secret-change-in-production',
}
