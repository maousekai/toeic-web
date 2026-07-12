import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

// GET: list all transactions with user info
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const url = new URL(req.url)
  const type = url.searchParams.get('type') // TOPUP | VIP_PURCHASE | null (all)
  const limit = parseInt(url.searchParams.get('limit') || '100')

  const where = type ? { type } : {}
  const transactions = await db.paymentTransaction.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  // Summary stats
  const [topupSum, vipSum, count] = await Promise.all([
    db.paymentTransaction.aggregate({ where: { type: 'TOPUP', status: 'SUCCESS' }, _sum: { amount: true } }),
    db.paymentTransaction.aggregate({ where: { type: 'VIP_PURCHASE', status: 'SUCCESS' }, _sum: { amount: true } }),
    db.paymentTransaction.count(),
  ])

  return NextResponse.json({
    transactions,
    summary: {
      totalTopup: topupSum._sum.amount || 0,
      totalVipRevenue: vipSum._sum.amount || 0,
      totalTransactions: count,
    },
  })
}
