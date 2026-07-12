import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, hasActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

function genRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

// POST: teacher creates a class session
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ giáo viên mới được mở lớp học' }, { status: 403 })
  }

  const { studentUserId } = (await req.json()) as { studentUserId?: string }
  if (!studentUserId) return NextResponse.json({ error: 'studentUserId required' }, { status: 400 })

  const session = await db.classSession.create({
    data: {
      teacherId: user.id,
      studentId: studentUserId,
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
