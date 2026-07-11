import ZAI from 'z-ai-web-dev-sdk'

export type Language = 'vi' | 'en' | 'bi'

// ===================================================================
//  AI PROVIDER ADAPTER
//  - Tự nhận diện Ollama + qwen2.5:3b đang chạy trên máy (không cần env)
//  - Nếu Ollama không chạy → fallback qua ZAI cloud (sandbox)
// ===================================================================

type Provider = 'ollama' | 'zai'

// Cấu hình Ollama mặc định (qwen2.5:3b)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b'
const OLLAMA_HOST = OLLAMA_BASE_URL.replace(/\/v1\/?$/, '')

// Cache kết quả probe để không gọi lại mỗi request
let probed: { provider: Provider; at: number } | null = null
const PROBE_TTL = 30_000 // 30s

/**
 * Tự nhận diện provider:
 *  1. Gọi `GET http://localhost:11434/api/tags` — nếu Ollama phản hồi
 *     và có qwen2.5:3b trong danh sách model → dùng Ollama.
 *  2. Nếu Ollama không chạy / không có qwen2.5:3b → fallback ZAI cloud.
 *
 * Kết quả được cache 30s để tránh probe mỗi request.
 */
async function detectProvider(): Promise<Provider> {
  const now = Date.now()
  if (probed && now - probed.at < PROBE_TTL) return probed.provider

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const data = (await res.json()) as { models?: { name: string }[] }
      const models = (data.models || []).map((m) => m.name)
      const hasQwen = models.some(
        (m) => m === OLLAMA_MODEL || m === `${OLLAMA_MODEL}:latest` || m.startsWith(`${OLLAMA_MODEL}:`),
      )
      probed = { provider: hasQwen ? 'ollama' : 'zai', at: now }
      return probed.provider
    }
  } catch {
    // Ollama không chạy → fallback
  }
  probed = { provider: 'zai', at: now }
  return 'zai'
}

// Singleton instances
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
let ollamaClient: any = null

async function getOllamaClient() {
  if (ollamaClient) return ollamaClient
  const { default: OpenAI } = await import('openai')
  ollamaClient = new OpenAI({
    apiKey: 'ollama', // Ollama không cần key
    baseURL: OLLAMA_BASE_URL,
    timeout: 5 * 60 * 1000, // 5 phút (CPU inference chậm)
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

  if (provider === 'zai') {
    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
    })
    return completion.choices[0]?.message?.content ?? ''
  }

  // Ollama + qwen2.5:3b
  const client = await getOllamaClient()
  try {
    const completion = await client.chat.completions.create({
      model: OLLAMA_MODEL,
      messages,
      temperature: 0.5, // model 3B nhỏ → nhiệt độ thấp để giảm "lan man"
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

// Cho UI hiển thị provider hiện tại (gọi detect để probe)
export async function getCurrentProvider(): Promise<{ provider: Provider; model: string }> {
  const provider = await detectProvider()
  return {
    provider,
    model: provider === 'ollama' ? OLLAMA_MODEL : 'zai-default',
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
