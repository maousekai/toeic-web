import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, hasActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

function genRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

// POST: create a class session
// - Teacher/Admin: creates class for a student { studentUserId }
// - Student (VIP): requests call with a teacher { teacherUserId }
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json()) as { studentUserId?: string; teacherUserId?: string }

  let teacherId: string
  let studentId: string

  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    // Giáo viên tạo lớp cho học sinh
    if (!body.studentUserId) {
      return NextResponse.json({ error: 'studentUserId required' }, { status: 400 })
    }
    teacherId = user.id
    studentId = body.studentUserId
  } else {
    // Học sinh yêu cầu call với giáo viên — cần VIP
    if (!body.teacherUserId) {
      return NextResponse.json({ error: 'teacherUserId required' }, { status: 400 })
    }
    const isVip = await hasActiveVip(user.id)
    if (!isVip) {
      return NextResponse.json({
        error: 'Cần gói VIP để gọi video call với giáo viên.',
        needVip: true,
      }, { status: 403 })
    }
    teacherId = body.teacherUserId
    studentId = user.id
  }

  const session = await db.classSession.create({
    data: {
      teacherId,
      studentId,
      roomCode: genRoomCode(),
      status: 'WAITING',
    },
  })

  return NextResponse.json({
    session,
    roomCode: session.roomCode,
    message: `Đã tạo lớp học. Mã phòng: ${session.roomCode}`,
  })
}
