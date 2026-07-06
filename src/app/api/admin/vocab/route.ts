import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const level = searchParams.get('level')
  const q = searchParams.get('q')
  const page = Number(searchParams.get('page') || '1')
  const pageSize = 50
  const where: any = {}
  if (level && level !== 'all') where.level = level
  if (q) where.word = { contains: q }
  const [vocabs, total] = await Promise.all([
    db.vocab.findMany({ where, orderBy: { word: 'asc' }, skip: (page - 1) * pageSize, take: pageSize }),
    db.vocab.count({ where }),
  ])
  return NextResponse.json({ vocabs, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const body = await req.json()
  const { word, phonetic, partOfSpeech, definition, example, translation, category, level } = body
  if (!word || !definition || !partOfSpeech) return NextResponse.json({ error: 'word, definition, partOfSpeech required' }, { status: 400 })
  const vocab = await db.vocab.create({ data: { word, phonetic: phonetic || null, partOfSpeech, definition, example: example || '', translation: translation || null, category: category || 'general', level: level || 'A1' } })
  return NextResponse.json({ vocab })
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const vocab = await db.vocab.update({ where: { id }, data })
  return NextResponse.json({ vocab })
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.vocab.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
