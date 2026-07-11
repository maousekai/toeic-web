import ZAI from 'z-ai-web-dev-sdk'

export type Language = 'vi' | 'en' | 'bi'

// ===================================================================
//  AI PROVIDER ADAPTER
//  - Tự động chọn provider dựa trên biến môi trường
//  - Thứ tự ưu tiên:
//    1. OLLAMA_BASE_URL     → chạy AI local (Ollama, miễn phí)
//    2. OPENAI_API_KEY      → OpenAI cloud
//    3. OPENROUTER_API_KEY  → OpenRouter (1 key, nhiều model)
//    4. GROQ_API_KEY        → Groq (cực nhanh, free)
//    5. GEMINI_API_KEY      → Google Gemini (free tier hào phóng)
//    6. (fallback) ZAI SDK  → sandbox Z.ai
// ===================================================================

type Provider = 'ollama' | 'openai' | 'openrouter' | 'groq' | 'gemini' | 'zai'

function detectProvider(): Provider {
  if (process.env.OLLAMA_BASE_URL) return 'ollama'
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.OPENROUTER_API_KEY) return 'openrouter'
  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  return 'zai'
}

const DEFAULT_MODELS: Record<Provider, string> = {
  ollama: process.env.OLLAMA_MODEL || 'qwen2.5:3b',
  openai: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  openrouter: process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-7b-instruct:free',
  groq: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  gemini: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  zai: 'zai-default',
}

const BASE_URLS: Record<Provider, string | undefined> = {
  ollama: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  openai: undefined, // SDK default
  openrouter: 'https://openrouter.ai/api/v1',
  groq: 'https://api.groq.com/openai/v1',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  zai: undefined,
}

function getApiKey(provider: Provider): string {
  switch (provider) {
    case 'ollama': return 'ollama' // Ollama không cần key, dùng string bất kỳ
    case 'openai': return process.env.OPENAI_API_KEY || ''
    case 'openrouter': return process.env.OPENROUTER_API_KEY || ''
    case 'groq': return process.env.GROQ_API_KEY || ''
    case 'gemini': return process.env.GEMINI_API_KEY || ''
    case 'zai': return ''
  }
}

// Singleton instances
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null
const openaiClients = new Map<Provider, any>()

async function getOpenAIClient(provider: Provider) {
  if (openaiClients.has(provider)) return openaiClients.get(provider)!
  // Dynamic import để tránh load SDK khi không dùng
  const { default: OpenAI } = await import('openai')
  // Ollama local inference trên CPU có thể chậm → timeout dài hơn (5 phút)
  const timeout = provider === 'ollama' ? 5 * 60 * 1000 : 60 * 1000
  const client = new OpenAI({
    apiKey: getApiKey(provider),
    baseURL: BASE_URLS[provider],
    timeout,
    maxRetries: provider === 'ollama' ? 1 : 2,
  })
  openaiClients.set(provider, client)
  return client
}

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function aiChat(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const provider = detectProvider()

  if (provider === 'zai') {
    // ZAI SDK (sandbox Z.ai)
    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
    })
    return completion.choices[0]?.message?.content ?? ''
  }

  // OpenAI-compatible providers (Ollama, OpenAI, OpenRouter, Groq, Gemini)
  const client = await getOpenAIClient(provider)
  const model = DEFAULT_MODELS[provider]

  // Tune tham số theo provider:
  // - Ollama + qwen2.5:3b (model nhỏ 3B): temperature thấp hơn để giảm "lan man",
  //   max_tokens để tránh treo, không stream cho đơn giản.
  // - Cloud providers: giữ nguyên 0.7.
  const isOllama = provider === 'ollama'
  const params: Record<string, unknown> = {
    model,
    messages,
    temperature: isOllama ? 0.5 : 0.7,
  }
  if (isOllama) {
    params.max_tokens = 1024
    params.stream = false
  }

  try {
    const completion = await client.chat.completions.create(params)
    const content = completion.choices[0]?.message?.content ?? ''
    if (!content && isOllama) {
      return '(Mô hình không trả về nội dung. Hãy thử chạy `ollama run qwen2.5:3b` để kiểm tra model hoạt động.)'
    }
    return content
  } catch (err: any) {
    if (isOllama) {
      // Ollama không chạy / model chưa pull → trả message hướng dẫn thay vì crash
      const msg = err?.message || String(err)
      if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('connect')) {
        throw new Error(
          'Không kết nối được với Ollama. Hãy chắc chắn Ollama đang chạy (`ollama serve`) và đã pull model (`ollama pull qwen2.5:3b`).'
        )
      }
      if (msg.includes('model') && msg.includes('not found')) {
        throw new Error(
          `Model "${model}" chưa có trong Ollama. Chạy: \`ollama pull ${model}\``
        )
      }
      throw new Error(`Lỗi Ollama: ${msg}`)
    }
    throw err
  }
}

// Cho UI hiển thị provider hiện tại (debug/info)
export function getCurrentProvider(): { provider: Provider; model: string } {
  const provider = detectProvider()
  return { provider, model: DEFAULT_MODELS[provider] }
}

/**
 * Kiểm tra Ollama có đang chạy và model có sẵn không.
 * Trả về { ok, message, models? }.
 * Chỉ dùng khi provider === 'ollama'.
 */
export async function checkOllamaHealth(): Promise<{
  ok: boolean
  message: string
  models?: string[]
}> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/v1\/?$/, '')
  try {
    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      return { ok: false, message: `Ollama responded HTTP ${res.status}` }
    }
    const data = (await res.json()) as { models?: { name: string }[] }
    const models = (data.models || []).map((m) => m.name)
    const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b'
    // Ollama trả về kèm :latest cho tag mặc định
    const hasModel = models.some(
      (m) => m === model || m === `${model}:latest` || m.startsWith(`${model}:`)
    )
    if (!hasModel) {
      return {
        ok: false,
        message: `Ollama đang chạy nhưng chưa có model "${model}". Chạy: \`ollama pull ${model}\``,
        models,
      }
    }
    return { ok: true, message: `Ollama sẵn sàng — model "${model}" đã sẵn có.`, models }
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('connect')) {
      return {
        ok: false,
        message:
          'Không kết nối được với Ollama. Hãy chạy `ollama serve` (hoặc mở app Ollama) rồi thử lại.',
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
