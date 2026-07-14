import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string
    const phonetic = formData.get('phonetic') as string
    const tip = formData.get('tip') as string
    const language = formData.get('language') as Language
    const audioFile = formData.get('audio') as File

    if (!text || !audioFile) {
      return NextResponse.json({ error: 'Text and Audio required' }, { status: 400 })
    }

    const lang: Language = language || 'vi'

    // 1. Gửi audio file tới Groq Whisper API để bóc băng (Speech-to-Text)
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Hệ thống chưa được cấu hình GROQ_API_KEY để xử lý giọng nói.' }, { status: 500 })
    }

    const groqFormData = new FormData()
    groqFormData.append('file', audioFile)
    groqFormData.append('model', 'whisper-large-v3')
    groqFormData.append('response_format', 'json')
    groqFormData.append('language', 'en')
    // Cung cấp từ gốc làm ngữ cảnh cho Whisper để tránh nhận diện sai các từ đơn lẻ
    groqFormData.append('prompt', text)

    const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: groqFormData,
    })

    if (!whisperRes.ok) {
      const err = await whisperRes.text()
      console.error('Groq Whisper error:', err)
      return NextResponse.json({ error: 'Failed to process audio with Groq API' }, { status: 500 })
    }

    const whisperData = await whisperRes.json()
    // Whisper thường tự thêm dấu câu hoặc in hoa, nên chuyển về chữ thường để AI dễ so sánh hơn
    const transcribedText = whisperData.text?.trim() || ''

    // 2. Dùng AI phân tích sự khác biệt
    const systemPrompt = `You are a friendly, encouraging English pronunciation coach for Vietnamese learners.
The user tried to pronounce the Target Word. The Transcribed Text is what the system heard.
If Transcribed Text matches Target Word: Congratulate them shortly (1-2 sentences).
If it's different: Explain simply what sound they might have missed or mispronounced (e.g. "It sounded like you said X instead of Y"). Give ONE brief tip on how to fix it.
CRITICAL: Keep the response extremely concise, natural, and friendly. Do NOT use bullet points, numbered lists, or section headers like "1. Tổng quan". Maximum 3-4 short sentences total.
${lang === 'vi' ? 'Trả lời hoàn toàn bằng tiếng Việt.' : 'Reply in English.'}`

    const userMsg = `Target Word: "${text}"
Transcribed Text: "${transcribedText}"

Evaluate my pronunciation briefly and kindly.`

    const feedback = await aiChat([
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: userMsg },
    ])

    return NextResponse.json({ feedback, transcribedText })
  } catch (e: any) {
    console.error('Pronunciation analyze error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}
