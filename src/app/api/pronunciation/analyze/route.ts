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
    const transcribedText = whisperData.text || ''

    // 2. Dùng AI phân tích sự khác biệt
    const systemPrompt = `You are an expert English pronunciation coach for Vietnamese learners.
Analyze the user's pronunciation attempt. You are given the "Target Word" they were supposed to say, and the "Transcribed Text" of what they actually said.
If the transcribed text matches or is very close to the target word, congratulate them and briefly note the correct mouth shape or stress.
If the transcribed text is different, point out exactly which sounds they probably mispronounced and how to fix it based on Vietnamese speaker habits.
Focus on: (1) differences between target and transcription, (2) difficult sounds, (3) word stress.
Be specific, practical and encouraging. Keep it under 200 words.
${lang === 'vi' ? 'Trả lời bằng tiếng Việt.' : 'Reply in English.'}`

    const userMsg = `Target Word: "${text}"
Transcribed Text (what they actually said): "${transcribedText}"
${phonetic ? `Phonetic: ${phonetic}` : ''}
${tip ? `Tip: ${tip}` : ''}

Hãy so sánh những gì họ thực sự nói (Transcribed Text) với từ gốc (Target Word), và đưa ra đánh giá phát âm chi tiết.`

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
