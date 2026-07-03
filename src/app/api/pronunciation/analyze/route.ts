import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { text, phonetic, tip, language } = (await req.json()) as {
      text: string
      phonetic?: string
      tip?: string
      language?: Language
    }

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const lang: Language = language || 'vi'

    // Vì browser không gửi audio thật (chỉ mô phỏng), mình dùng AI để đưa ra
    // feedback pronunciation tips dựa trên text + phonetic
    const systemPrompt = `You are an expert English pronunciation coach for Vietnamese learners.
Analyze the given English sentence and provide pronunciation feedback in Vietnamese.
Focus on: (1) difficult sounds for Vietnamese speakers, (2) word stress, (3) intonation, (4) connected speech.
Be specific, practical and encouraging. Keep it under 200 words.
${lang === 'vi' ? 'Trả lời bằng tiếng Việt.' : 'Reply in English.'}`

    const userMsg = `Sentence: "${text}"
${phonetic ? `Phonetic: ${phonetic}` : ''}
${tip ? `Tip: ${tip}` : ''}

Hãy phân tích và đưa ra:
1. Âm nào khó phát âm cho người Việt (kèm hướng dẫn cách đặt môi/lưỡi)
2. Trọng âm rơi vào âm tiết nào
3. Ngữ điệu câu (lên hay xuống giọng)
4. Nơi nên nối âm khi nói nhanh
5. Đánh giá tổng quan và lời khuyên`

    const feedback = await aiChat([
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: userMsg },
    ])

    return NextResponse.json({ feedback })
  } catch (e: any) {
    console.error('Pronunciation analyze error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
