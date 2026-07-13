'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft, Crown, Loader2, Paperclip } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Msg = {
  id: string
  roomId: string
  senderId: string
  content: string
  createdAt: string
  sender?: { id: string; name: string }
}

export function ChatView() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { toast } = useToast()
  const [roomId, setRoomId] = useState<string | null>(view.name === 'chat' ? view.roomId ?? null : null)
  const [room, setRoom] = useState<any>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [typing, setTyping] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: 'Ảnh quá lớn', description: 'Kích thước tối đa 4MB', variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setUploadingImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Establish chat room if not provided
  const ensureRoom = useCallback(async () => {
    if (!user) { setLoading(false); return }
    if (roomId) return
    const teacherUserId = view.name === 'chat' ? view.teacherUserId : null
    if (!teacherUserId) { setLoading(false); return }
    const res = await fetch('/api/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherUserId }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) setRoomId(data.room.id)
    else if (data.needVip) {
      toast({ title: 'Cần VIP', description: data.error, variant: 'destructive' })
      navigate({ name: 'vip' })
    }
  }, [user, roomId, view, navigate, toast])

  useEffect(() => { ensureRoom() }, [ensureRoom])

  // Load messages + room info
  useEffect(() => {
    if (!roomId || !user) return
    Promise.all([
      fetch(`/api/chat/rooms/${roomId}/messages`).then((r) => r.json().catch(() => ({}))),
      fetch('/api/chat/rooms').then((r) => r.json().catch(() => ({}))),
    ]).then(([msgData, roomsData]) => {
      setMessages(msgData.messages || [])
      const r = (roomsData.rooms || []).find((x: any) => x.id === roomId)
      setRoom(r)
      setLoading(false)
    })
  }, [roomId, user])

  // Socket.io connection
  useEffect(() => {
    if (!user || !roomId) return
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' && window.location.port === '3000'
      ? 'http://localhost:3003'
      : '/?XTransformPort=3003')
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('auth', { userId: user.id, role: user.role, name: user.name })
      socket.emit('chat:join', roomId)
    })

    socket.on('chat:message', (msg: Msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on('chat:typing', () => {
      setTyping(true)
      setTimeout(() => setTyping(false), 2000)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user, roomId])

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = async () => {
    if ((!input.trim() && !uploadingImage) || !roomId || !user) return
    const content = uploadingImage ? `[image]:${uploadingImage}` : input.trim()
    setInput('')
    setUploadingImage(null)

    // Optimistic: add message immediately
    const tempId = `temp_${Date.now()}`
    const optimistic: Msg = {
      id: tempId,
      roomId,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
      sender: { id: user.id, name: user.name },
    }
    setMessages((prev) => [...prev, optimistic])

    // Emit via socket for real-time
    socketRef.current?.emit('chat:message', {
      id: optimistic.id,
      roomId,
      senderId: user.id,
      senderName: user.name,
      content,
      createdAt: optimistic.createdAt,
      sender: { id: user.id, name: user.name },
    })

    // Persist via API
    try {
      await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
    } catch (e) {
      // silent — optimistic already shown
    }
  }

  const handleTyping = () => {
    if (!roomId || !user) return
    socketRef.current?.emit('chat:typing', { roomId, userId: user.id, name: user.name })
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p>Đăng nhập để chat</p>
        <Button className="mt-4" onClick={() => openAuth('login')}>Đăng nhập</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const otherPerson = room ? (room.teacher.id === user.id ? room.student : room.teacher) : null

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate({ name: 'teachers' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-sm font-bold text-primary-foreground">
            {otherPerson?.name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('') || '?'}
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">{otherPerson?.name || 'Đang tải...'}</p>
          <p className="text-xs text-emerald-600">● Online</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Crown className="h-3 w-3 text-amber-500" /> VIP
        </Badge>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((m) => {
          const isMe = m.senderId === user.id
          return (
            <div key={m.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                  isMe
                    ? 'rounded-tr-sm bg-primary text-primary-foreground'
                    : 'rounded-tl-sm bg-secondary'
                )}
              >
                {m.content.startsWith('[image]:') ? (
                  <img
                    src={m.content.substring(8)}
                    alt="Ảnh gửi qua chat"
                    className="max-h-60 rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      const newTab = window.open()
                      if (newTab) {
                        newTab.document.write(`<img src="${m.content.substring(8)}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`)
                        newTab.document.title = "Xem ảnh"
                      }
                    }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                )}
                <p className={cn('mt-1 text-[10px]', isMe ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t py-3 space-y-2">
        {/* Image Preview */}
        {uploadingImage && (
          <div className="relative max-w-[120px] border rounded-lg p-1 bg-muted flex items-center justify-center group shadow-sm">
            <img
              src={uploadingImage}
              alt="Preview"
              className="h-16 w-auto object-contain rounded"
            />
            <button
              type="button"
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 text-[10px] font-bold shadow"
              onClick={() => setUploadingImage(null)}
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder={uploadingImage ? "Nhấn gửi để gửi ảnh..." : "Nhập tin nhắn..."}
            value={input}
            onChange={(e) => { setInput(e.target.value); handleTyping() }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() && !uploadingImage} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
