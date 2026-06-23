import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = (await req.json()) as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      language?: Language
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }
    const lang: Language = language || 'vi'
    const full = [{ role: 'assistant' as const, content: SYSTEM_PROMPTS.tutor(lang) }, ...messages]
    const reply = await aiChat(full)
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error('AI chat error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
