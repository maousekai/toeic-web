import { NextResponse } from 'next/server'
import { getSessionUser, getActiveVip, ensureWallet } from '@/lib/auth-helpers'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [vip, wallet] = await Promise.all([
    getActiveVip(user.id),
    ensureWallet(user.id),
  ])

  return NextResponse.json({
    isVip: !!vip,
    package: vip?.package?.name || null,
    expiresAt: vip?.expiresAt || null,
    daysLeft: vip ? Math.ceil((vip.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
    balance: wallet?.balance || 0,
  })
}
