import { NextRequest, NextResponse } from 'next/server'
import { aiChat, SYSTEM_PROMPTS, type Language } from '@/lib/ai'
import { getSessionUser, hasActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

const FREE_LIMIT = 10 // Học sinh thường được 10 câu

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      language?: Language
      image?: string // base64 image (VIP only)
    }
    const { messages, language, image } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Lấy user (có thể ẩn danh — vẫn cho dùng nhưng giới hạn)
    const session = await getSessionUser()
    let isVip = false
    let count = 0
    let remaining = FREE_LIMIT

    if (session) {
      const user = await db.user.findUnique({
        where: { id: session.id },
        select: { aiMessageCount: true, role: true },
      })
      isVip = user?.role === 'ADMIN' || user?.role === 'TEACHER' || (await hasActiveVip(session.id))
      count = user?.aiMessageCount || 0
      remaining = isVip ? Infinity : Math.max(0, FREE_LIMIT - count)

      // Nếu không VIP và đã hết 10 câu → block
      if (!isVip && count >= FREE_LIMIT) {
        return NextResponse.json({
          error: 'Bạn đã dùng hết 10 câu hỏi AI miễn phí. Nâng cấp VIP để chat không giới hạn + tải ảnh lên.',
          needVip: true,
          used: count,
          limit: FREE_LIMIT,
        }, { status: 403 })
      }

      // Nếu có ảnh nhưng không VIP → block
      if (image && !isVip) {
        return NextResponse.json({
          error: 'Tải ảnh lên chỉ dành cho thành viên VIP. Nâng cấp VIP để dùng tính năng này.',
          needVip: true,
        }, { status: 403 })
      }
    } else {
      // User ẩn danh — cũng giới hạn 10 câu (lưu trong localStorage client-side, check ở frontend)
      // Server vẫn cho qua, frontend sẽ enforce
    }

    const lang: Language = language || 'vi'
    const full = [{ role: 'assistant' as const, content: SYSTEM_PROMPTS.tutor(lang) }, ...messages]

    // Nếu có ảnh (VIP) → dùng VLM
    let reply: string
    if (image && isVip) {
      reply = await aiChatWithImage(full, image)
    } else {
      reply = await aiChat(full)
    }

    // Tăng counter cho user (nếu đăng nhập)
    if (session && !isVip) {
      await db.user.update({
        where: { id: session.id },
        data: { aiMessageCount: { increment: 1 } },
      })
      count += 1
      remaining = Math.max(0, FREE_LIMIT - count)
    }

    return NextResponse.json({
      reply,
      usage: {
        isVip,
        used: isVip ? count : count,
        remaining: isVip ? '∞' : remaining,
        limit: isVip ? null : FREE_LIMIT,
      },
    })
  } catch (e: any) {
    console.error('AI chat error:', e)
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}

/**
 * Chat với ảnh (VLM) — thử OpenRouter → ZAI → Ollama llava.
 */
async function aiChatWithImage(messages: { role: string; content: string }[], imageBase64: string): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || 'Describe this image.'
  const imageUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
  const systemText = messages[0]?.content || ''

  // --- Ưu tiên 1: Gemini (nếu có API key) ---
  if (process.env.GEMINI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      })
      // Dùng model vision-capable trên Gemini
      const visionModel = process.env.GEMINI_VISION_MODEL || 'gemini-2.0-flash'
      const response = await client.chat.completions.create({
        model: visionModel,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `${systemText}\n\nUser question: ${lastUserMsg}` },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      })
      return response.choices[0]?.message?.content ?? ''
    } catch (orErr: any) {
      console.error('Gemini vision error, falling back:', orErr?.message)
      // Fall through to next provider
    }
  }

  // --- Ưu tiên 2: ZAI Vision ---
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `${systemText}\n\nUser question: ${lastUserMsg}` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    })
    return response.choices[0]?.message?.content ?? ''
  } catch {
    // Fall through to Ollama
  }

  // --- Ưu tiên 3: Ollama llava (local) ---
  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({
    apiKey: 'ollama',
    baseURL: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1',
  })
  try {
    const response = await client.chat.completions.create({
      model: 'llava',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: lastUserMsg },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    })
    return response.choices[0]?.message?.content ?? ''
  } catch (ollamaErr: any) {
    if (ollamaErr?.message?.includes('not found') || ollamaErr?.message?.includes('model')) {
      throw new Error('Tính năng gửi ảnh yêu cầu model AI Vision. Chạy: `ollama pull llava` để cài đặt.')
    }
    throw new Error(`Lỗi nhận diện ảnh: ${ollamaErr?.message || String(ollamaErr)}`)
  }
}

/**
 * GET: trả về usage hiện tại của user.
 */
export async function GET() {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ isVip: false, used: 0, remaining: FREE_LIMIT, limit: FREE_LIMIT, anonymous: true })
  }
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { aiMessageCount: true, role: true },
  })
  const isVip = user?.role === 'ADMIN' || user?.role === 'TEACHER' || (await hasActiveVip(session.id))
  const count = user?.aiMessageCount || 0
  return NextResponse.json({
    isVip,
    used: count,
    remaining: isVip ? '∞' : Math.max(0, FREE_LIMIT - count),
    limit: isVip ? null : FREE_LIMIT,
  })
}
