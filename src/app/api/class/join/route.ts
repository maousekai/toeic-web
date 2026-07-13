import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, hasActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// POST: student joins a class by roomCode (VIP required)
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // VIP gate (Giáo viên và Admin không cần VIP)
  const isVip = user.role === 'ADMIN' || user.role === 'TEACHER' || (await hasActiveVip(user.id))
  if (!isVip) {
    return NextResponse.json({
      error: 'Cần gói VIP để tham gia lớp học video call.',
      needVip: true,
    }, { status: 403 })
  }

  const { roomCode } = (await req.json()) as { roomCode?: string }
  if (!roomCode) return NextResponse.json({ error: 'roomCode required' }, { status: 400 })

  const session = await db.classSession.findUnique({ where: { roomCode: roomCode.toUpperCase().trim() } })
  if (!session) return NextResponse.json({ error: 'Phòng học không tồn tại' }, { status: 404 })
  if (session.status === 'ENDED') return NextResponse.json({ error: 'Phòng học đã kết thúc' }, { status: 400 })

  // Mark active
  if (session.status === 'WAITING') {
    await db.classSession.update({
      where: { id: session.id },
      data: { status: 'ACTIVE', startedAt: new Date() },
    })
  }

  return NextResponse.json({ session })
}
