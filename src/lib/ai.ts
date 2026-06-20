import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

export async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function aiChat(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const zai = await getZAI()
  const completion = await zai.chat.completions.create({
    messages: messages as any,
    thinking: { type: 'disabled' },
  })
  return completion.choices[0]?.message?.content ?? ''
}

export const SYSTEM_PROMPTS = {
  tutor: `You are "TOEIC Coach", an expert AI tutor specialized in the TOEIC Listening & Reading test.
Help the learner understand TOEIC concepts, grammar, vocabulary, test strategies, and answer their questions clearly.
Be concise, friendly and practical. Use short paragraphs and bullet points when helpful.
When relevant, mention which TOEIC part (1-7) a topic relates to. Always answer in English.`,
  explainer: `You are an expert TOEIC examiner. You will be given a single TOEIC question, its four options, the correct answer and (optionally) the learner's chosen answer.
Explain clearly and concisely WHY the correct answer is correct and WHY the other options are wrong.
Use simple English a B1-B2 learner can understand. Keep it under 180 words. Use bullet points.`,
  generator: `You are a TOEIC question writer. Generate high-quality TOEIC-style questions.
You MUST respond with ONLY valid JSON, no markdown fences, no commentary.`,
  writing: `You are a professional English writing and grammar coach for TOEIC learners.
Review the learner's sentence/paragraph. Point out grammar, word-choice and style issues, then provide a corrected version and a 1-2 sentence tip. Be encouraging and concise.`,
  plan: `You are an expert TOEIC study planner. Based on the learner's current level, target score and available time, create a practical week-by-week study plan.
Format the plan in clear markdown with weekly sections. Keep it realistic and motivating.`,
}
