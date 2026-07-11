import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const users = await db.user.findMany({
    where: { role: { not: 'ADMIN' } },
    select: { id: true, name: true, email: true, role: true, locked: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users })
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const body = await req.json()
  const { id, role, locked } = body as { id?: string; role?: string; locked?: boolean }

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Safety: never allow locking / demoting an ADMIN account from this endpoint
  const target = await db.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (target.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot modify an ADMIN account' }, { status: 400 })
  }

  const data: { role?: string; locked?: boolean } = {}
  if (role !== undefined) data.role = role
  if (locked !== undefined) data.locked = Boolean(locked)

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update (provide role or locked)' }, { status: 400 })
  }

  const user = await db.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, locked: true, createdAt: true },
  })
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Safety: never delete an ADMIN account
  const target = await db.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (target.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot delete an ADMIN account' }, { status: 400 })
  }

  await db.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
