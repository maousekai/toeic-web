import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

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

// PUT: update user — name, email, locked, role, resetAiCount, addBalance, resetPassword
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const body = (await req.json()) as {
    name?: string
    email?: string
    locked?: boolean
    role?: string
    resetAiCount?: boolean
    addBalance?: number
    resetPassword?: string
  }

  // Kiểm tra user tồn tại
  const target = await db.user.findUnique({ where: { id }, select: { id: true, role: true } })
  if (!target) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
  // Không cho sửa ADMIN
  if (target.role === 'ADMIN') {
    return NextResponse.json({ error: 'Không thể sửa tài khoản ADMIN' }, { status: 400 })
  }

  const data: any = {}
  if (body.name !== undefined) data.name = body.name
  if (body.email !== undefined) {
    // Kiểm tra email trùng
    const existing = await db.user.findUnique({ where: { email: body.email.toLowerCase().trim() } })
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 })
    }
    data.email = body.email.toLowerCase().trim()
  }
  if (body.locked !== undefined) data.locked = body.locked
  if (body.role !== undefined && body.role !== 'ADMIN') data.role = body.role
  if (body.resetAiCount) data.aiMessageCount = 0
  // Reset password
  if (body.resetPassword && body.resetPassword.length >= 6) {
    data.passwordHash = await bcrypt.hash(body.resetPassword, 10)
  }

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

// DELETE: delete user (cannot delete ADMIN)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const target = await db.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
  if (target.role === 'ADMIN') {
    return NextResponse.json({ error: 'Không thể xoá tài khoản ADMIN' }, { status: 400 })
  }
  await db.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
