import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'TEACHER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ giáo viên' }, { status: 403 })
  }

  // Lấy tất cả học sinh đã chat/call với giáo viên này
  const chatRooms = await db.chatRoom.findMany({
    where: { teacherId: session.id },
    include: {
      student: {
        select: {
          id: true, name: true, email: true, image: true, locked: true, createdAt: true,
        },
      },
      messages: { select: { id: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  // Group theo student
  const studentMap = new Map<string, any>()
  for (const r of chatRooms) {
    if (!studentMap.has(r.student.id)) {
      studentMap.set(r.student.id, {
        ...r.student,
        chatRoomId: r.id,
        messageCount: r._count.messages,
        lastInteraction: r.lastMessageAt || r.createdAt,
      })
    } else {
      const existing = studentMap.get(r.student.id)
      existing.messageCount += r._count.messages
    }
  }

  return NextResponse.json({
    students: Array.from(studentMap.values()),
  })
}
