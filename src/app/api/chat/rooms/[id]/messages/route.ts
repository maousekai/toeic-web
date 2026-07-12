import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// GET: list messages in a room
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: roomId } = await params

  // Verify user is member of this room
  const room = await db.chatRoom.findUnique({ where: { id: roomId } })
  if (!room || (room.studentId !== user.id && room.teacherId !== user.id)) {
    return NextResponse.json({ error: 'Không có quyền truy cập phòng chat này' }, { status: 403 })
  }

  const messages = await db.chatMessage.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: {
      sender: { select: { id: true, name: true } },
    },
  })

  // Mark unread messages as read
  await db.chatMessage.updateMany({
    where: { roomId, senderId: { not: user.id }, read: false },
    data: { read: true },
  })

  return NextResponse.json({ messages })
}

// POST: send a message (persist) — realtime delivery happens via socket.io
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: roomId } = await params
  const { content } = (await req.json()) as { content?: string }
  if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const room = await db.chatRoom.findUnique({ where: { id: roomId } })
  if (!room || (room.studentId !== user.id && room.teacherId !== user.id)) {
    return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
  }

  const message = await db.chatMessage.create({
    data: {
      roomId,
      senderId: user.id,
      content: content.trim(),
    },
    include: {
      sender: { select: { id: true, name: true } },
    },
  })

  await db.chatRoom.update({
    where: { id: roomId },
    data: { lastMessageAt: new Date() },
  })

  return NextResponse.json({ message })
}
