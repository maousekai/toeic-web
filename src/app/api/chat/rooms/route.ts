import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, hasActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// GET: list chat rooms for current user
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rooms = await db.chatRoom.findMany({
    where: {
      OR: [{ studentId: user.id }, { teacherId: user.id }],
    },
    include: {
      student: { select: { id: true, name: true, image: true } },
      teacher: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, createdAt: true, senderId: true },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  return NextResponse.json({ rooms })
}

// POST: create or get chat room with a teacher
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // VIP gate: chỉ VIP mới được chat với giáo viên
  const isVip = await hasActiveVip(user.id)
  if (!isVip) {
    return NextResponse.json({
      error: 'Cần gói VIP để chat với giáo viên. Vui lòng mua VIP.',
      needVip: true,
    }, { status: 403 })
  }

  const { teacherUserId } = (await req.json()) as { teacherUserId?: string }
  if (!teacherUserId) return NextResponse.json({ error: 'teacherUserId required' }, { status: 400 })

  if (teacherUserId === user.id) {
    return NextResponse.json({ error: 'Không thể chat với chính mình' }, { status: 400 })
  }

  // Find or create room
  const existing = await db.chatRoom.findFirst({
    where: {
      OR: [
        { studentId: user.id, teacherId: teacherUserId },
        { studentId: teacherUserId, teacherId: user.id },
      ],
    },
  })

  if (existing) {
    return NextResponse.json({ room: existing, created: false })
  }

  const room = await db.chatRoom.create({
    data: {
      studentId: user.id,
      teacherId: teacherUserId,
    },
  })
  return NextResponse.json({ room, created: true })
}
