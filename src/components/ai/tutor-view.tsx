'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, GraduationCap, RotateCcw, Bot, User, ImagePlus, X, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/site/markdown'
import { LanguageToggle } from '@/components/site/language-toggle'
import { useLanguage } from '@/lib/use-language'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from '@/lib/router'
import { cn } from '@/lib/utils'

type Msg = { role: 'user' | 'assistant'; content: string; image?: string }

type ProviderInfo = {
  provider: string
  model: string
  name: string
  icon: string
  isLocal: boolean
  health?: { ok: boolean; message: string; models?: string[] }
}

type Usage = {
  isVip: boolean
  used: number
  remaining: number | string
  limit: number | null
  anonymous?: boolean
}
// Giới hạn số lượt chat miễn phí cho phép đối với tài khoản thường
const FREE_LIMIT = 10
// Danh sách các câu hỏi gợi ý nhanh (Suggestions) hiển thị cho người học TOEIC
const SUGGESTIONS = [
  'Explain the difference between "since" and "for".',
  'Give me a tip for Part 2 listening questions.',
  'How is the TOEIC Listening & Reading test scored?',
  'What are the most common grammar topics on Part 5?',
]

export function TutorView() {
  const { toast } = useToast()
  const { language, labels } = useLanguage()
  const { navigate } = useRouter()
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: `Hi! I'm your **TOEIC Coach** 🎓\n\nAsk me anything about the TOEIC test — grammar, vocabulary, listening strategies, reading tips, or how the scoring works. How can I help you today?\n\n💡 I'm currently replying in **${labels.long}** — change this anytime from the top bar.` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null) // base64
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // Fetch provider info
  useEffect(() => {
    fetch('/api/ai/provider')
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setProviderInfo(d))
      .catch(() => {})
  }, [])

  // Fetch usage info
  const fetchUsage = useCallback(() => {
    fetch('/api/ai/chat')
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setUsage(d))
      .catch(() => {})
  }, [])
  useEffect(() => { fetchUsage() }, [fetchUsage])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: 'Ảnh quá lớn', description: 'Kích thước tối đa 4MB', variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    // Check limit client-side (nếu không VIP)
    if (usage && !usage.isVip && typeof usage.remaining === 'number' && usage.remaining <= 0) {
      toast({
        title: 'Đã hết câu hỏi miễn phí',
        description: `Bạn đã dùng hết ${FREE_LIMIT} câu. Nâng cấp VIP để chat không giới hạn + tải ảnh.`,
        variant: 'destructive',
      })
      setTimeout(() => navigate({ name: 'vip' }), 1500)
      return
    }

    setInput('')
    const userMsg: Msg = { role: 'user', content: trimmed }
    if (image) userMsg.image = image
    const next: Msg[] = [...messages, userMsg]
    setMessages(next)
    setImage(null)
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
          image: userMsg.image,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
        // Update usage từ response
        if (data.usage) {
          setUsage(data.usage)
        } else {
          fetchUsage()
        }
      } else if (data.needVip) {
        toast({
          title: 'Cần VIP',
          description: data.error || 'Nâng cấp VIP để tiếp tục',
          variant: 'destructive',
        })
        setTimeout(() => navigate({ name: 'vip' }), 1500)
      } else {
        toast({ title: 'AI unavailable', description: data.error || 'Try again', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [messages, loading, language, toast, usage, image, navigate, fetchUsage])

  const reset = () => {
    setMessages([{ role: 'assistant', content: `Hi! I'm your **TOEIC Coach** 🎓\n\nWhat would you like to learn today?\n\n💡 Currently replying in **${labels.long}**.` }])
  }

  const isVip = usage?.isVip
  const isBlocked = !isVip && typeof usage?.remaining === 'number' && usage.remaining <= 0

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
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="gap-1 text-[10px]" title={`Model: ${providerInfo.model}`}>
                  {providerInfo.icon} {providerInfo.name}
                  {providerInfo.isLocal && <span className="text-emerald-500">· 100% offline</span>}
                </Badge>
                {providerInfo.isLocal && providerInfo.health && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1 text-[10px] ' +
                      (providerInfo.health.ok
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-600')
                    )}
                    title={providerInfo.health.message}
                  >
                    {providerInfo.health.ok ? '✅ Sẵn sàng' : '⚠️ Chưa kết nối'}
                  </Badge>
                )}
              </div>
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

      {/* Usage banner */}
      {usage && (
        <div className={cn(
          'mb-3 flex items-center justify-between rounded-lg border p-3 text-sm',
          isVip
            ? 'border-amber-500/30 bg-amber-500/5'
            : isBlocked
              ? 'border-rose-500/30 bg-rose-500/5'
              : 'border-border bg-secondary/30'
        )}>
          <div className="flex items-center gap-2">
            {isVip ? (
              <>
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="font-medium">VIP Member</span>
                <span className="text-muted-foreground">· AI không giới hạn + tải ảnh</span>
              </>
            ) : isBlocked ? (
              <>
                <X className="h-4 w-4 text-rose-500" />
                <span className="font-medium text-rose-600">Đã hết câu miễn phí</span>
                <span className="text-muted-foreground">· Nâng cấp VIP để tiếp tục</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">Free tier</span>
                <span className="text-muted-foreground">· Còn {usage.remaining}/{FREE_LIMIT} câu</span>
              </>
            )}
          </div>
          {!isVip && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate({ name: 'vip' })}>
              <Crown className="h-3.5 w-3.5 text-amber-500" /> Nâng cấp VIP
            </Button>
          )}
        </div>
      )}

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] space-y-2`}>
                {m.image && (
                  <div className="overflow-hidden rounded-xl border border-border/60">
                    <img src={m.image} alt="Uploaded" className="max-h-48 w-auto object-cover" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-secondary'}`}>
                  {m.role === 'assistant' ? <Markdown content={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
                </div>
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

        {/* Image preview */}
        {image && (
          <div className="border-t border-border/60 p-2">
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="h-20 w-20 rounded-lg border border-border object-cover" />
              <button
                onClick={() => setImage(null)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/60 p-3">
          <div className="flex items-end gap-2">
            {/* Upload button — only VIP */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => {
                if (!isVip) {
                  toast({
                    title: 'Tính năng VIP',
                    description: 'Tải ảnh lên chỉ dành cho thành viên VIP.',
                    variant: 'destructive',
                  })
                  setTimeout(() => navigate({ name: 'vip' }), 1000)
                  return
                }
                fileInputRef.current?.click()
              }}
              title={isVip ? 'Tải ảnh lên' : 'Cần VIP để tải ảnh'}
            >
              <ImagePlus className={cn('h-4 w-4', !isVip && 'text-muted-foreground')} />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder={isBlocked ? 'Đã hết câu miễn phí — nâng cấp VIP để tiếp tục...' : 'Ask anything about TOEIC…'}
              rows={1}
              className="max-h-32 resize-none"
              disabled={loading || isBlocked}
            />
            <Button size="icon" onClick={() => send(input)} disabled={loading || !input.trim() || isBlocked} className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
