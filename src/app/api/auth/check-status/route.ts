import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Pre-login account status check.
 *
 * Used by the login modal because NextAuth v4 does not propagate the specific
 * error message thrown inside `authorize()` back to the client — the client
 * only receives the generic `CredentialsSignin` error code.
 *
 * Request:  POST { email: string }
 * Response: 200 { exists: boolean, locked: boolean }
 *           400 on bad input
 *
 * Security: This endpoint intentionally only reveals whether an account exists
 * AND is locked. It does NOT reveal whether the password is correct, and it
 * does not lock out accounts itself (rate-limit at the edge if needed).
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string }
    if (!email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }
    const cleanEmail = email.toLowerCase().trim()
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
      select: { locked: true },
    })
    return NextResponse.json({
      exists: !!user,
      locked: !!user?.locked,
    })
  } catch (e: any) {
    console.error('check-status error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
