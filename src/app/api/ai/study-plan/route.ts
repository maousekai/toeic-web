import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { currentLevel, targetScore, weeksAvailable, studyTimePerDay, focusAreas, language } = (await req.json()) as {
      currentLevel?: string
      targetScore?: number
      weeksAvailable?: number
      studyTimePerDay?: string
      focusAreas?: string
      language?: Language
    }

    const lang: Language = language || 'vi'
    const userMsg = `Create a personalized TOEIC study plan.
- Current level: ${currentLevel || 'unknown'}
- Target TOEIC score: ${targetScore || 750}
- Time available: ${weeksAvailable || 8} weeks
- Can study: ${studyTimePerDay || '1-2 hours per day'}
- Areas to focus on: ${focusAreas || 'all sections'}

Format the response in clear markdown with weekly sections (Week 1, Week 2, ...) listing listening, reading, grammar and vocabulary tasks. End with a short motivational note.`

    const reply = await aiChat([
      { role: 'assistant', content: SYSTEM_PROMPTS.plan(lang) },
      { role: 'user', content: userMsg },
    ])
    return NextResponse.json({ plan: reply })
  } catch (e: any) {
    console.error('AI study plan error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
