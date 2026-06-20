import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { question, options, correctAnswer, selectedAnswer, passage, part } = (await req.json()) as {
      question: string
      options: string[]
      correctAnswer: number
      selectedAnswer?: number | null
      passage?: string
      part?: number
    }

    const letters = ['A', 'B', 'C', 'D']
    const optsText = options.map((o, i) => `${letters[i]}. ${o}`).join('\n')
    const userMsg = `Part ${part || '?'} question:
${passage ? `Passage:\n${passage}\n\n` : ''}Question: ${question}
Options:
${optsText}

Correct answer: ${letters[correctAnswer]}. ${options[correctAnswer]}
${selectedAnswer !== undefined && selectedAnswer !== null ? `Learner's answer: ${letters[selectedAnswer]}. ${options[selectedAnswer]}` : 'Learner did not answer.'}

Explain why the correct answer is correct and why the others are wrong.`

    const reply = await aiChat([
      { role: 'assistant', content: SYSTEM_PROMPTS.explainer },
      { role: 'user', content: userMsg },
    ])
    return NextResponse.json({ explanation: reply })
  } catch (e: any) {
    console.error('AI explain error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
