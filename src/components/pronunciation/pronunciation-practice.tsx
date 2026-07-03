'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Volume2, Mic, Square, Play, Pause, RotateCcw, Sparkles, ChevronLeft, ChevronRight,
  Lightbulb, Target, CheckCircle2, AlertCircle, Loader2, Waves,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Markdown } from '@/components/site/markdown'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  PRONUNCIATION_EXAMPLES, PRONUNCIATION_CATEGORIES, getExamplesByLevel, type PronunciationExample,
} from '@/data/pronunciation-examples'

const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
const LEVEL_LABELS: Record<string, { vn: string; color: string }> = {
  A0: { vn: 'Tiền sơ cấp', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  A1: { vn: 'Sơ cấp', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  A2: { vn: 'Sơ trung cấp', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  B1: { vn: 'Trung cấp', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  B2: { vn: 'Trung cao cấp', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  C1: { vn: 'Cao cấp', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  C2: { vn: 'Thành thạo', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
}

type Phase = 'idle' | 'recording' | 'recorded' | 'analyzing' | 'analyzed'

export function PronunciationPractice() {
  const { toast } = useToast()
  const [selectedLevel, setSelectedLevel] = useState<string>('A1')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [feedback, setFeedback] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const examples = getExamplesByLevel(selectedLevel)
  const current = examples[currentIdx]

  // Reset khi đổi level
  useEffect(() => {
    setCurrentIdx(0)
    setPhase('idle')
    setFeedback('')
    setAudioUrl(null)
    setRecordingTime(0)
  }, [selectedLevel])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // Speak the example sentence (TTS)
  const speak = useCallback((text: string, rate = 0.85) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    u.onstart = () => setIsPlaying(true)
    u.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(u)
  }, [])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast({ title: 'Không hỗ trợ ghi âm', description: 'Trình duyệt của bạn không hỗ trợ ghi âm.', variant: 'destructive' })
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setPhase('recorded')
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
        }
      }

      mr.start()
      setPhase('recording')
      setRecordingTime(0)
      setFeedback('')
      setAudioUrl(null)
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)
    } catch (e: any) {
      toast({
        title: 'Không truy cập được micro',
        description: 'Vui lòng cho phép truy cập micro trong trình duyệt.',
        variant: 'destructive',
      })
    }
  }, [toast])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Analyze with AI
  const analyze = useCallback(async () => {
    if (!current) return
    setPhase('analyzing')
    try {
      const res = await fetch('/api/pronunciation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: current.text,
          phonetic: current.phonetic,
          tip: current.tip,
          language: 'vi',
        }),
      })
      const data = await res.json()
      if (data.feedback) {
        setFeedback(data.feedback)
        setPhase('analyzed')
      } else {
        toast({ title: 'Phân tích thất bại', description: data.error, variant: 'destructive' })
        setPhase('recorded')
      }
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' })
      setPhase('recorded')
    }
  }, [current, toast])

  const reset = () => {
    setPhase('idle')
    setFeedback('')
    setAudioUrl(null)
    setRecordingTime(0)
  }

  const next = () => {
    if (currentIdx < examples.length - 1) {
      setCurrentIdx((i) => i + 1)
      reset()
    }
  }
  const prev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1)
      reset()
    }
  }

  if (examples.length === 0) {
    return (
      <Card><CardContent className="p-10 text-center text-muted-foreground">
        Chưa có ví dụ cho cấp độ này.
      </CardContent></Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Luyện phát âm</h2>
        <p className="text-sm text-muted-foreground">
          Nghe câu mẫu, ghi âm giọng nói của bạn, nhận feedback AI chi tiết về phát âm.
        </p>
      </div>

      {/* Level selector */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((level) => {
          const count = getExamplesByLevel(level).length
          if (count === 0) return null
          const active = level === selectedLevel
          const meta = LEVEL_LABELS[level]
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                active ? 'bg-primary text-primary-foreground shadow-sm' : meta.color + ' hover:opacity-80'
              )}
            >
              {level} · {count}
            </button>
          )
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Câu {currentIdx + 1} / {examples.length}</span>
        <Badge variant="outline" className="gap-1">
          <Target className="h-3 w-3" /> {LEVEL_LABELS[selectedLevel].vn}
        </Badge>
      </div>

      {/* Sentence card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-primary/20">
          {/* Sentence */}
          <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-2xl font-bold leading-relaxed">{current.text}</p>
                <p className="mt-2 text-sm text-muted-foreground font-mono">{current.phonetic}</p>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => speak(current.text)}
                disabled={isPlaying}
                className="shrink-0"
                aria-label="Nghe mẫu"
              >
                {isPlaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Tip */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="flex items-start gap-2 text-xs">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span><strong className="text-amber-700 dark:text-amber-400">Mẹo phát âm:</strong> {current.tip}</span>
              </p>
            </div>

            {/* Focus sounds */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Âm cần chú ý:</span>
              {current.focusSounds.map((s, i) => (
                <Badge key={i} variant="secondary" className="font-mono text-xs">{s}</Badge>
              ))}
            </div>

            {/* Recording controls */}
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              {phase === 'idle' && (
                <div className="flex flex-col items-center gap-3 py-2">
                  <Button onClick={startRecording} size="lg" className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 p-0">
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-xs text-muted-foreground">Bấm vào micro để bắt đầu ghi âm</p>
                </div>
              )}

              {phase === 'recording' && (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-sm font-medium tabular-nums">{recordingTime}s</span>
                    </div>
                    <Button onClick={stopRecording} size="lg" variant="destructive" className="h-14 w-14 rounded-full p-0">
                      <Square className="h-5 w-5" />
                    </Button>
                    <Waves className="h-5 w-5 text-rose-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-muted-foreground">Đang ghi âm... Đọc câu trên thành tiếng</p>
                </div>
              )}

              {(phase === 'recorded' || phase === 'analyzing' || phase === 'analyzed') && audioUrl && (
                <div className="flex flex-col items-center gap-3 py-2">
                  <audio src={audioUrl} controls className="w-full max-w-md" />
                  <div className="flex gap-2">
                    <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" /> Ghi lại
                    </Button>
                    {phase !== 'analyzing' && phase !== 'analyzed' && (
                      <Button onClick={analyze} size="sm" className="gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> AI đánh giá phát âm
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {phase === 'analyzing' && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> AI đang phân tích phát âm của bạn...
                </div>
              )}
            </div>

            {/* AI Feedback */}
            {phase === 'analyzed' && feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-4"
              >
                <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> AI Phân tích phát âm
                </div>
                <Markdown content={feedback} className="text-sm" />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={currentIdx === 0} onClick={prev}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Câu trước
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentIdx + 1} / {examples.length}
        </span>
        <Button variant="outline" disabled={currentIdx === examples.length - 1} onClick={next}>
          Câu tiếp <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Categories info */}
      <Card className="bg-secondary/20">
        <CardContent className="p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">📚 Các chủ đề luyện phát âm:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRONUNCIATION_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 rounded-lg border border-border/60 p-2">
                <span className="text-base">{cat.icon}</span>
                <div>
                  <div className="text-xs font-medium">{cat.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{cat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
