import { NextResponse } from 'next/server'
import { getSessionUser, ensureWallet } from '@/lib/auth-helpers'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const wallet = await ensureWallet(user.id)
  return NextResponse.json({ balance: wallet?.balance || 0 })
}
