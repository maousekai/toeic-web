import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { text, language } = (await req.json()) as { text: string; language?: Language }
    if (!text || text.trim().length < 3) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }
    const lang: Language = language || 'vi'
    const reply = await aiChat([
      { role: 'assistant', content: SYSTEM_PROMPTS.writing(lang) },
      { role: 'user', content: `Review this English text from a TOEIC learner:\n\n"${text}"` },
    ])
    return NextResponse.json({ feedback: reply })
  } catch (e: any) {
    console.error('AI writing check error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
