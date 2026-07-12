import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const [users, vocabs, grammarLessons, questions, testSets, attempts, teachers, vipSubs, totalTopup, totalVipRevenue] = await Promise.all([
    db.user.count({ where: { role: { not: 'ADMIN' } } }),
    db.vocab.count(), db.grammarLesson.count(), db.question.count(), db.testSet.count(), db.testAttempt.count(),
    db.teacher.count(),
    db.vipSubscription.count({ where: { isActive: true, expiresAt: { gt: new Date() } } }),
    db.paymentTransaction.aggregate({ where: { type: 'TOPUP', status: 'SUCCESS' }, _sum: { amount: true } }),
    db.paymentTransaction.aggregate({ where: { type: 'VIP_PURCHASE', status: 'SUCCESS' }, _sum: { amount: true } }),
  ])
  const vocabByLevel = await db.vocab.groupBy({ by: ['level'], _count: true })
  return NextResponse.json({
    stats: {
      users, vocabs, grammarLessons, questions, testSets, attempts,
      teachers,
      activeVipSubs: vipSubs,
      totalTopup: totalTopup._sum.amount || 0,
      totalVipRevenue: totalVipRevenue._sum.amount || 0,
    },
    vocabByLevel,
  })
}
