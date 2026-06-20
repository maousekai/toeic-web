import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { part, topic, difficulty, count } = (await req.json()) as {
      part: number
      topic?: string
      difficulty?: string
      count?: number
    }

    const n = Math.min(Math.max(count || 3, 1), 5)
    const diff = difficulty || 'intermediate'

    const userMsg = `Generate ${n} TOEIC Part ${part} practice question(s).
${topic ? `Topic/grammar focus: ${topic}.` : ''}
Difficulty: ${diff}.

Return ONLY a JSON object with this exact shape (no markdown, no commentary):
{
  "questions": [
    {
      "part": ${part},
      "passage": null,
      "question": "the question text with a blank shown as ____ if it is a fill-in-the-blank",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": 0,
      "explanation": "short explanation",
      "category": "grammar category"
    }
  ]
}

For Part 2 (question-response), put the spoken question in "question" prefixed with "Audio: " and make options spoken responses. Do not include a passage.
For Part 5/6/7, use realistic business English.`

    const raw = await aiChat([
      { role: 'assistant', content: SYSTEM_PROMPTS.generator },
      { role: 'user', content: userMsg },
    ])

    // Try to extract JSON
    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      const m = raw.match(/\{[\s\S]*\}/)
      if (m) {
        try { parsed = JSON.parse(m[0]) } catch {}
      }
    }

    if (!parsed || !Array.isArray(parsed.questions)) {
      return NextResponse.json({ error: 'Failed to parse generated questions', raw }, { status: 502 })
    }
    return NextResponse.json({ questions: parsed.questions })
  } catch (e: any) {
    console.error('AI generate error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
