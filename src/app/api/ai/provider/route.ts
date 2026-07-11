import { NextResponse } from 'next/server'
import { getCurrentProvider, checkOllamaHealth } from '@/lib/ai'

export async function GET() {
  const { provider, model } = await getCurrentProvider()
  const labels: Record<string, { name: string; icon: string; isLocal: boolean }> = {
    ollama: { name: 'Ollama (Local AI)', icon: '🦙', isLocal: true },
    zai: { name: 'ZAI Cloud', icon: '🤖', isLocal: false },
  }
  const info = labels[provider] || labels.zai

  const response: {
    provider: string
    model: string
    name: string
    icon: string
    isLocal: boolean
    health?: { ok: boolean; message: string; models?: string[] }
  } = {
    provider,
    model,
    name: info.name,
    icon: info.icon,
    isLocal: info.isLocal,
  }

  // Nếu provider là Ollama, kiểm tra trạng thái kết nối
  if (provider === 'ollama') {
    response.health = await checkOllamaHealth()
  }

  return NextResponse.json(response)
}
