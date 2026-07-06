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
  const users = await db.user.findMany({ where: { role: { not: 'ADMIN' } }, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ users })
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id, role } = await req.json()
  if (!id || !role) return NextResponse.json({ error: 'id and role required' }, { status: 400 })
  const user = await db.user.update({ where: { id }, data: { role } })
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
