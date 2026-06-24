'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, GraduationCap, RotateCcw, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/site/markdown'
import { LanguageToggle } from '@/components/site/language-toggle'
import { useLanguage } from '@/lib/use-language'
import { useToast } from '@/hooks/use-toast'

type Msg = { role: 'user' | 'assistant'; content: string }

type ProviderInfo = {
  provider: string
  model: string
  name: string
  icon: string
  isLocal: boolean
}

const SUGGESTIONS = [
  'Explain the difference between "since" and "for".',
  'Give me a tip for Part 2 listening questions.',
  'How is the TOEIC Listening & Reading test scored?',
  'What are the most common grammar topics on Part 5?',
]

export function TutorView() {
  const { toast } = useToast()
  const { language, labels } = useLanguage()
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: `Hi! I'm your **TOEIC Coach** 🎓\n\nAsk me anything about the TOEIC test — grammar, vocabulary, listening strategies, reading tips, or how the scoring works. How can I help you today?\n\n💡 I'm currently replying in **${labels.long}** — change this anytime from the top bar.` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // Fetch current AI provider info for badge
  useEffect(() => {
    fetch('/api/ai/provider')
      .then((r) => r.json())
      .then((d) => setProviderInfo(d))
      .catch(() => {})
  }, [])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          messages: next
            .filter((m) => !(m.role === 'assistant' && m.content.startsWith('Hi!')))
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      } else {
        toast({ title: 'AI unavailable', description: data.error || 'Try again', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [messages, loading, language, toast])

  const reset = () => {
    setMessages([{ role: 'assistant', content: `Hi! I'm your **TOEIC Coach** 🎓\n\nWhat would you like to learn today?\n\n💡 Currently replying in **${labels.long}**.` }])
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold">AI TOEIC Tutor</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">Online · replying in {labels.flag} {labels.long}</span>
            </p>
            {providerInfo && (
              <Badge variant="outline" className="mt-1 gap-1 text-[10px]" title={`Model: ${providerInfo.model}`}>
                {providerInfo.icon} {providerInfo.name}
                {providerInfo.isLocal && <span className="text-emerald-500">· 100% offline</span>}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-secondary'}`}>
                {m.role === 'assistant' ? <Markdown content={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="border-t border-border/60 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/60 p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask anything about TOEIC…"
              rows={1}
              className="max-h-32 resize-none"
              disabled={loading}
            />
            <Button size="icon" onClick={() => send(input)} disabled={loading || !input.trim()} className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
