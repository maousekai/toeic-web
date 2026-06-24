import { NextResponse } from 'next/server'
import { getCurrentProvider } from '@/lib/ai'

export async function GET() {
  const { provider, model } = getCurrentProvider()
  const labels: Record<string, { name: string; icon: string; isLocal: boolean }> = {
    ollama: { name: 'Ollama (Local AI)', icon: '🦙', isLocal: true },
    openai: { name: 'OpenAI', icon: '🟢', isLocal: false },
    openrouter: { name: 'OpenRouter', icon: '🔌', isLocal: false },
    groq: { name: 'Groq', icon: '⚡', isLocal: false },
    gemini: { name: 'Google Gemini', icon: '✨', isLocal: false },
    zai: { name: 'ZAI Cloud', icon: '🤖', isLocal: false },
  }
  const info = labels[provider] || labels.zai
  return NextResponse.json({
    provider,
    model,
    name: info.name,
    icon: info.icon,
    isLocal: info.isLocal,
  })
}
