import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const transactions = await db.paymentTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ transactions })
}
