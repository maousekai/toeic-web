import ZAI from 'z-ai-web-dev-sdk'

export type Language = 'vi' | 'en' | 'bi'

// ===================================================================
//  AI PROVIDER ADAPTER
//  Thứ tự ưu tiên:
//  1. Gemini (cloud)     — nếu có GEMINI_API_KEY trong .env
//  2. Ollama (local)     — nếu Ollama đang chạy trên máy
//  3. ZAI (legacy)       — fallback cuối cùng
// ===================================================================

type Provider = 'gemini' | 'ollama' | 'zai'

// Gemini config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/'

// Ollama config
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b'
const OLLAMA_HOST = OLLAMA_BASE_URL.replace(/\/v1\/?$/, '')

// Cache kết quả probe
let probed: { provider: Provider; at: number } | null = null
const PROBE_TTL = 30_000 // 30s

/**
 * Tự nhận diện provider:
 *  1. Nếu có GEMINI_API_KEY → dùng Gemini (cloud).
 *  2. Nếu Ollama đang chạy và có model → dùng Ollama (local).
 *  3. Fallback → ZAI cloud (sandbox).
 */
async function detectProvider(): Promise<Provider> {
  const now = Date.now()
  if (probed && now - probed.at < PROBE_TTL) return probed.provider

  // Ưu tiên 1: Gemini (nếu có API key)
  if (GEMINI_API_KEY) {
    probed = { provider: 'gemini', at: now }
    return 'gemini'
  }

  // Ưu tiên 2: Ollama local
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const data = (await res.json()) as { models?: { name: string }[] }
      const models = (data.models || []).map((m) => m.name)
      const hasModel = models.some(
        (m) => m === OLLAMA_MODEL || m === `${OLLAMA_MODEL}:latest` || m.startsWith(`${OLLAMA_MODEL}:`),
      )
      if (hasModel) {
        probed = { provider: 'ollama', at: now }
        return 'ollama'
      }
    }
  } catch {
    // Ollama không chạy
  }

  // Ưu tiên 3: ZAI fallback
  probed = { provider: 'zai', at: now }
  return 'zai'
}

// Singleton clients
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
let ollamaClient: any = null
let geminiClient: any = null

async function getGeminiClient() {
  if (geminiClient) return geminiClient
  const { default: OpenAI } = await import('openai')
  geminiClient = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: GEMINI_BASE_URL,
    timeout: 2 * 60 * 1000, // 2 phút
    maxRetries: 2,
  })
  return geminiClient
}

async function getOllamaClient() {
  if (ollamaClient) return ollamaClient
  const { default: OpenAI } = await import('openai')
  ollamaClient = new OpenAI({
    apiKey: 'ollama',
    baseURL: OLLAMA_BASE_URL,
    timeout: 5 * 60 * 1000,
    maxRetries: 1,
  })
  return ollamaClient
}

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function aiChat(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const provider = await detectProvider()

  // --- Gemini (cloud) ---
  if (provider === 'gemini') {
    const client = await getGeminiClient()
    const models = GEMINI_MODEL.split(',').map((m) => m.trim()).filter(Boolean)
    let lastError: any = null

    for (const model of models) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages,
          temperature: 0.5,
          max_tokens: 2048,
          stream: false,
        })
        return completion.choices[0]?.message?.content ?? ''
      } catch (err: any) {
        lastError = err
        const msg = err?.message || String(err)
        if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('API key')) {
          throw new Error('Gemini API Key không hợp lệ. Kiểm tra lại GEMINI_API_KEY trong file .env')
        }
        console.warn(`[Gemini] Lỗi model ${model}: ${msg}. Đang thử model tiếp theo...`)
        // Tiếp tục vòng lặp để thử model khác
      }
    }

    const msg = lastError?.message || String(lastError)
    if (msg.includes('429') || msg.includes('rate')) {
      throw new Error('Đã vượt giới hạn request của Gemini. Vui lòng thử lại sau vài giây.')
    }
    throw new Error(`Lỗi Gemini: ${msg}`)
  }

  // --- ZAI (legacy fallback) ---
  if (provider === 'zai') {
    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
    })
    return completion.choices[0]?.message?.content ?? ''
  }

  // --- Ollama (local) ---
  const client = await getOllamaClient()
  try {
    const completion = await client.chat.completions.create({
      model: OLLAMA_MODEL,
      messages,
      temperature: 0.5,
      max_tokens: 1024,
      stream: false,
    })
    return completion.choices[0]?.message?.content ?? ''
  } catch (err: any) {
    const msg = err?.message || String(err)
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('connect') || msg.includes('Connection error')) {
      throw new Error(
        'Không kết nối được với Ollama. Hãy chạy `ollama serve` và `ollama pull qwen2.5:3b` rồi thử lại.',
      )
    }
    if (msg.includes('model') && msg.includes('not found')) {
      throw new Error(`Model "${OLLAMA_MODEL}" chưa có. Chạy: \`ollama pull ${OLLAMA_MODEL}\``)
    }
    throw new Error(`Lỗi Ollama: ${msg}`)
  }
}

// Cho UI hiển thị provider hiện tại
export async function getCurrentProvider(): Promise<{ provider: Provider; model: string }> {
  const provider = await detectProvider()
  return {
    provider,
    model: provider === 'gemini' ? GEMINI_MODEL : provider === 'ollama' ? OLLAMA_MODEL : 'zai-default',
  }
}

/**
 * Kiểm tra Ollama có đang chạy và có qwen2.5:3b không.
 */
export async function checkOllamaHealth(): Promise<{
  ok: boolean
  message: string
  models?: string[]
}> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { ok: false, message: `Ollama responded HTTP ${res.status}` }
    const data = (await res.json()) as { models?: { name: string }[] }
    const models = (data.models || []).map((m) => m.name)
    const hasModel = models.some(
      (m) => m === OLLAMA_MODEL || m === `${OLLAMA_MODEL}:latest` || m.startsWith(`${OLLAMA_MODEL}:`),
    )
    if (!hasModel) {
      return {
        ok: false,
        message: `Ollama đang chạy nhưng chưa có model "${OLLAMA_MODEL}". Chạy: \`ollama pull ${OLLAMA_MODEL}\``,
        models,
      }
    }
    return { ok: true, message: `Ollama sẵn sàng — model "${OLLAMA_MODEL}" đã sẵn có.`, models }
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('connect')) {
      return {
        ok: false,
        message: 'Không kết nối được với Ollama. Hãy chạy `ollama serve` (hoặc mở app Ollama) rồi thử lại.',
      }
    }
    if (msg.includes('abort') || msg.includes('timeout')) {
      return { ok: false, message: 'Ollama không phản hồi sau 5s — có thể đang khởi động.' }
    }
    return { ok: false, message: `Lỗi kết nối Ollama: ${msg}` }
  }
}

// ===================================================================
//  SYSTEM PROMPTS (có thể nhận language)
// ===================================================================

const LANG_NAME: Record<Language, string> = {
  vi: 'Vietnamese (Tiếng Việt)',
  en: 'English',
  bi: 'both Vietnamese and English',
}

const LANG_INSTRUCTION: Record<Language, string> = {
  vi: `Trả lời hoàn toàn bằng TIẾNG VIỆT. Khi nhắc đến thuật ngữ ngữ pháp/toán học tiếng Anh (ví dụ "present perfect", "distractor"), hãy kèm nghĩa tiếng Việt trong ngoặc lần đầu tiên xuất hiện, ví dụ: "present perfect (thì hiện tại hoàn thành)".`,
  en: `Always answer in English.`,
  bi: `Trả lời BẰNG SONG NGỮ: câu giải thích chính bằng tiếng Việt, sau đó kèm các thuật ngữ tiếng Anh trong ngoặc vuông. Ví dụ: "Đáp án đúng là B vì đây là thì hiện tại hoàn thành [Present Perfect]". Các ví dụ câu tiếng Anh giữ nguyên không dịch.`,
}

function langLine(lang: Language) {
  return `Output language: ${LANG_NAME[lang]}. ${LANG_INSTRUCTION[lang]}`
}

export const SYSTEM_PROMPTS = {
  tutor: (lang: Language) => `You are "TOEIC Coach", an expert AI tutor specialized in the TOEIC Listening & Reading test.
Help the learner understand TOEIC concepts, grammar, vocabulary, test strategies, and answer their questions clearly.
Be concise, friendly and practical. Use short paragraphs and bullet points when helpful.
When relevant, mention which TOEIC part (1-7) a topic relates to.
${langLine(lang)}`,

  explainer: (lang: Language) => `You are an expert TOEIC examiner. You will be given a single TOEIC question, its four options, the correct answer and (optionally) the learner's chosen answer.
Explain clearly and concisely WHY the correct answer is correct and WHY the other options are wrong.
Keep it under 200 words. Use bullet points.
${langLine(lang)}
Note: The TOEIC question text and options are always in English — never translate them. Only your explanation follows the output language above.`,

  generator: `You are a TOEIC question writer. Generate high-quality TOEIC-style questions.
You MUST respond with ONLY valid JSON, no markdown fences, no commentary.
The generated questions and options must always be in English (this is a TOEIC test). Only the "explanation" field may follow the learner's requested language.`,

  writing: (lang: Language) => `You are a professional English writing and grammar coach for TOEIC learners.
Review the learner's sentence/paragraph. Point out grammar, word-choice and style issues, then provide a corrected version and a 1-2 sentence tip. Be encouraging and concise.
${langLine(lang)}
Note: The learner's original text is in English — never translate it. Only your feedback follows the output language above.`,

  plan: (lang: Language) => `You are an expert TOEIC study planner. Based on the learner's current level, target score and available time, create a practical week-by-week study plan.
Format the plan in clear markdown with weekly sections. Keep it realistic and motivating.
${langLine(lang)}`,
}

export function generatorPrompt(lang: Language) {
  return `${SYSTEM_PROMPTS.generator}
For the "explanation" field of each generated question, write it in ${LANG_NAME[lang]}.`
}
