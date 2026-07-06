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
  const lessons = await db.grammarLesson.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json({ lessons })
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { title, slug, category, level, summary, content, example } = await req.json()
  if (!title || !slug || !content) return NextResponse.json({ error: 'title, slug, content required' }, { status: 400 })
  const lesson = await db.grammarLesson.create({ data: { title, slug, category: category || 'general', level: level || 'intermediate', summary: summary || '', content, example: example || '' } })
  return NextResponse.json({ lesson })
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const lesson = await db.grammarLesson.update({ where: { id }, data })
  return NextResponse.json({ lesson })
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.grammarLesson.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
