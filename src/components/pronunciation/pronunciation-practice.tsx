'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Volume2, Mic, Square, RotateCcw, Sparkles, ChevronLeft, ChevronRight,
  Lightbulb, Loader2, Mic2, Smile,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/site/markdown'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/site/back-button'
import {
  SOUND_GROUPS, SOUND_CATEGORIES, getSoundsByType, type SoundGroup,
} from '@/data/pronunciation-examples'

type Phase = 'idle' | 'recording' | 'recorded' | 'analyzing' | 'analyzed'

export function PronunciationPractice() {
  const { toast } = useToast()
  const [activeType, setActiveType] = useState<'vowel' | 'consonant'>('vowel')
  const [selectedSound, setSelectedSound] = useState<SoundGroup | null>(null)
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [feedback, setFeedback] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const sounds = getSoundsByType(activeType)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // Speak word
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

  // Recording
  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast({ title: 'Không hỗ trợ ghi âm', description: 'Trình duyệt không hỗ trợ.', variant: 'destructive' })
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(blob))
        setPhase('recorded')
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setPhase('recording')
      setRecordingTime(0)
      setFeedback('')
      setAudioUrl(null)
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } catch {
      toast({ title: 'Không truy cập được micro', description: 'Vui lòng cho phép truy cập micro.', variant: 'destructive' })
    }
  }, [toast])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  // AI analyze
  const analyze = useCallback(async () => {
    if (!selectedSound) return
    const word = selectedSound.exampleWords[wordIdx]
    setPhase('analyzing')
    try {
      const res = await fetch('/api/pronunciation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: word.word,
          phonetic: word.phonetic,
          tip: `Âm ${selectedSound.ipa} (${selectedSound.name}). ${selectedSound.description} Khẩu hình: ${selectedSound.mouthShape}`,
          language: 'vi',
        }),
      })
      const data = await res.json()
      if (data.feedback) { setFeedback(data.feedback); setPhase('analyzed') }
      else { toast({ title: 'Phân tích thất bại', description: data.error, variant: 'destructive' }); setPhase('recorded') }
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' })
      setPhase('recorded')
    }
  }, [selectedSound, wordIdx, toast])

  const reset = () => { setPhase('idle'); setFeedback(''); setAudioUrl(null); setRecordingTime(0) }

  const selectSound = (s: SoundGroup) => {
    setSelectedSound(s)
    setWordIdx(0)
    reset()
  }

  const nextWord = () => {
    if (!selectedSound) return
    setWordIdx((i) => (i + 1) % selectedSound.exampleWords.length)
    reset()
  }
  const prevWord = () => {
    if (!selectedSound) return
    setWordIdx((i) => (i - 1 + selectedSound.exampleWords.length) % selectedSound.exampleWords.length)
    reset()
  }

  // ===== SOUND DETAIL VIEW =====
  if (selectedSound) {
    const word = selectedSound.exampleWords[wordIdx]
    return (
      <div className="space-y-6">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => { setSelectedSound(null); reset() }} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Tất cả âm {activeType === 'vowel' ? 'nguyên' : 'phụ'}
        </Button>

        {/* Sound header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={cn('overflow-hidden', activeType === 'vowel' ? 'border-emerald-500/30' : 'border-teal-500/30')}>
            <div className={cn('p-6', activeType === 'vowel' ? 'bg-gradient-to-br from-emerald-500/10 to-transparent' : 'bg-gradient-to-br from-teal-500/10 to-transparent')}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold font-mono',
                  activeType === 'vowel' ? 'bg-emerald-500 text-white' : 'bg-teal-500 text-white'
                )}>
                  {selectedSound.ipa.replace(/\//g, '')}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{selectedSound.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{selectedSound.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1 font-mono">
                      <Volume2 className="h-3 w-3" /> {selectedSound.ipa}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Smile className="h-3 w-3" /> {selectedSound.mouthShape}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => speak(selectedSound.exampleWords[0].word)}
                  disabled={isPlaying}
                  className="hidden sm:flex shrink-0"
                >
                  {isPlaying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
                  Nghe mẫu
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Word list — All example words */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Danh sách từ ví dụ ({selectedSound.exampleWords.length} từ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {selectedSound.exampleWords.map((w, i) => {
                const isActive = i === wordIdx
                return (
                  <button
                    key={i}
                    onClick={() => { setWordIdx(i); reset() }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-3 text-left transition-all',
                      isActive
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{w.word}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{w.phonetic}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">{w.meaning}</div>
                    </div>
                    <Volume2
                      className="h-4 w-4 shrink-0 text-muted-foreground hover:text-primary"
                      onClick={(e) => { e.stopPropagation(); speak(w.word) }}
                    />
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current word — Practice */}
        <motion.div key={word.word} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-3xl font-bold">{word.word}</p>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">{word.phonetic}</p>
                  <p className="mt-1 text-sm italic text-primary">{word.meaning}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => speak(word.word)}
                  disabled={isPlaying}
                  className="shrink-0"
                  aria-label="Nghe"
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
                  <span><strong className="text-amber-700 dark:text-amber-400">Cách phát âm:</strong> {selectedSound.description}</span>
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-xs">
                  <Smile className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span><strong className="text-amber-700 dark:text-amber-400">Khẩu hình:</strong> {selectedSound.mouthShape}</span>
                </p>
              </div>

              {/* Recording controls */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                {phase === 'idle' && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Button onClick={startRecording} size="lg" className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 p-0">
                      <Mic className="h-6 w-6" />
                    </Button>
                    <p className="text-xs text-muted-foreground">Bấm vào micro để ghi âm phát âm của bạn</p>
                  </div>
                )}
                {phase === 'recording' && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-sm font-medium tabular-nums">{recordingTime}s</span>
                      <Button onClick={stopRecording} size="lg" variant="destructive" className="h-14 w-14 rounded-full p-0">
                        <Square className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Đang ghi âm... Đọc từ <strong>{word.word}</strong> thành tiếng</p>
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
                          <Sparkles className="h-3.5 w-3.5" /> AI đánh giá
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
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

        {/* Word navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevWord}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Từ trước
          </Button>
          <span className="text-xs text-muted-foreground">
            {wordIdx + 1} / {selectedSound.exampleWords.length}
          </span>
          <Button variant="outline" onClick={nextWord}>
            Từ tiếp <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // ===== SOUND GROUPS LIST VIEW =====
  return (
    <div className="space-y-6">
      <BackButton targetView={{ name: 'learn' }} label="Trung tâm học tập" />
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Luyện phát âm theo nhóm âm</h2>
        <p className="text-sm text-muted-foreground">
          Hệ thống 44 âm tiếng Anh (20 nguyên âm + 24 phụ âm) — mỗi âm có ví dụ, phiên âm IPA, mô tả khẩu hình, ghi âm và AI feedback.
        </p>
      </div>

      {/* Type selector */}
      <div className="flex gap-2">
        {SOUND_CATEGORIES.map((cat) => {
          const active = cat.id === activeType
          const count = getSoundsByType(cat.id as 'vowel' | 'consonant').length
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveType(cat.id as 'vowel' | 'consonant'); setSelectedSound(null) }}
              className={cn(
                'flex-1 rounded-xl border p-4 text-left transition-all',
                active ? 'border-primary shadow-md scale-[1.02]' : 'border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <Badge variant="secondary">{count} âm</Badge>
              </div>
              <div className="mt-1 font-semibold">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.desc}</div>
            </button>
          )
        })}
      </div>

      {/* Sound grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sounds.map((sound, i) => (
          <motion.button
            key={sound.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            onClick={() => selectSound(sound)}
            className={cn(
              'group rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md',
              activeType === 'vowel' ? 'border-emerald-500/30 hover:border-emerald-500/60' : 'border-teal-500/30 hover:border-teal-500/60'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg font-mono text-xl font-bold',
                activeType === 'vowel' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-teal-500/10 text-teal-600'
              )}>
                {sound.ipa.replace(/\//g, '')}
              </span>
              <Volume2
                className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); speak(sound.exampleWords[0].word) }}
              />
            </div>
            <div className="font-semibold text-sm">{sound.name}</div>
            <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
              {sound.description.split('.')[0]}.
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Mic2 className="h-3 w-3" /> {sound.exampleWords.length} từ ví dụ
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
