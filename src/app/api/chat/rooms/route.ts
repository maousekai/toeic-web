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

// POST: create or get chat room with a teacher (or student if teacher initiates)
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { teacherUserId, studentUserId } = (await req.json()) as {
    teacherUserId?: string; studentUserId?: string
  }

  // Xác định studentId và teacherId
  let studentId: string | undefined
  let teacherId: string | undefined

  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    // Giáo viên tạo chat với học sinh — không cần VIP
    studentId = studentUserId
    teacherId = user.id
    if (!studentId) return NextResponse.json({ error: 'studentUserId required' }, { status: 400 })
  } else {
    // Học sinh tạo chat với giáo viên — cần VIP
    const isVip = await hasActiveVip(user.id)
    if (!isVip) {
      return NextResponse.json({
        error: 'Cần gói VIP để chat với giáo viên. Vui lòng mua VIP.',
        needVip: true,
      }, { status: 403 })
    }
    studentId = user.id
    teacherId = teacherUserId
    if (!teacherId) return NextResponse.json({ error: 'teacherUserId required' }, { status: 400 })
  }

  if (studentId === teacherId) {
    return NextResponse.json({ error: 'Không thể chat với chính mình' }, { status: 400 })
  }

  // Find or create room
  const existing = await db.chatRoom.findFirst({
    where: {
      OR: [
        { studentId, teacherId },
        { studentId: teacherId, teacherId: studentId },
      ],
    },
  })

  if (existing) {
    return NextResponse.json({ room: existing, created: false })
  }

  const room = await db.chatRoom.create({
    data: { studentId, teacherId },
  })
  return NextResponse.json({ room, created: true })
}
