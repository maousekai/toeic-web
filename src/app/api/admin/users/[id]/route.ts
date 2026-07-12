import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

// GET: user detail — wallet, vip, payments, ai usage, chat rooms, class sessions
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params

  const [user, wallet, activeVip, vipHistory, payments, chatRooms, classSessions, testAttempts] = await Promise.all([
    db.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, locked: true, aiMessageCount: true, image: true, createdAt: true },
    }),
    db.wallet.findUnique({ where: { userId: id } }),
    db.vipSubscription.findFirst({
      where: { userId: id, isActive: true, expiresAt: { gt: new Date() } },
      include: { package: true },
      orderBy: { expiresAt: 'desc' },
    }),
    db.vipSubscription.findMany({
      where: { userId: id },
      include: { package: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.paymentTransaction.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    db.chatRoom.findMany({
      where: { OR: [{ studentId: id }, { teacherId: id }] },
      include: {
        student: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.classSession.findMany({
      where: { OR: [{ teacherId: id }, { studentId: id }] },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.testAttempt.findMany({
      where: { learner: { userId: id } },
      orderBy: { startedAt: 'desc' },
      take: 20,
    }),
  ])

  if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

  return NextResponse.json({
    user,
    wallet: wallet || { balance: 0 },
    activeVip,
    vipHistory,
    payments,
    chatRooms,
    classSessions,
    testAttempts,
    stats: {
      totalPayments: payments.reduce((s, p) => s + (p.type === 'TOPUP' ? p.amount : 0), 0),
      totalVipSpent: payments.reduce((s, p) => s + (p.type === 'VIP_PURCHASE' ? p.amount : 0), 0),
      chatRoomsCount: chatRooms.length,
      classSessionsCount: classSessions.length,
      testAttemptsCount: testAttempts.length,
    },
  })
}

// PUT: update user (lock/unlock, role, aiMessageCount reset)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const body = (await req.json()) as {
    locked?: boolean; role?: string; resetAiCount?: boolean; addBalance?: number
  }

  const data: any = {}
  if (body.locked !== undefined) data.locked = body.locked
  if (body.role !== undefined) data.role = body.role
  if (body.resetAiCount) data.aiMessageCount = 0

  const updates: any[] = [db.user.update({ where: { id }, data })]

  // Add balance (admin gift)
  if (body.addBalance && body.addBalance > 0) {
    updates.push(
      db.wallet.upsert({
        where: { userId: id },
        update: { balance: { increment: body.addBalance } },
        create: { userId: id, balance: body.addBalance },
      })
    )
    updates.push(
      db.paymentTransaction.create({
        data: {
          userId: id,
          amount: body.addBalance,
          type: 'TOPUP',
          status: 'SUCCESS',
          description: 'Admin tặng tiền',
        },
      })
    )
  }

  await db.$transaction(updates)
  return NextResponse.json({ success: true })
}
