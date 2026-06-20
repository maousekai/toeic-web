import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const q = searchParams.get('q')?.toLowerCase()

  const where: any = {}
  if (category && category !== 'all') where.category = category
  if (difficulty && difficulty !== 'all') where.difficulty = Number(difficulty)
  if (q) where.word = { contains: q }

  const vocabs = await db.vocab.findMany({ where, orderBy: { word: 'asc' }, take: 200 })
  return NextResponse.json({ vocabs })
}
