'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Clock, ChevronLeft, ChevronRight, Flag, Volume2, AlertCircle, Headphones,
  CheckCircle2, Trophy, EyeOff, VolumeX, ShieldAlert,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter, getLearnerId } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

type Question = {
  id: string
  part: number
  passage: string | null
  audioScript: string | null
  question: string
  options: string[]
  answer: number
}

type TestSet = {
  id: string
  title: string
  durationMin: number
  type: string
  questionIds: string[]
}

type TestMode = 'practice' | 'exam'

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const PART_LABEL: Record<number, string> = {
  1: 'Part 1 · Photographs',
  2: 'Part 2 · Question-Response',
  3: 'Part 3 · Conversations',
  4: 'Part 4 · Talks',
  5: 'Part 5 · Incomplete Sentences',
  6: 'Part 6 · Text Completion',
  7: 'Part 7 · Reading Comprehension',
}

export function TestEngine({ testSetId, mode = 'practice' }: { testSetId: string; mode?: TestMode }) {
  const isExam = mode === 'exam'
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [testSet, setTestSet] = useState<TestSet | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showWarning5min, setShowWarning5min] = useState(false)
  const startedAtRef = useRef<number>(Date.now())
  const playedRef = useRef<Set<string>>(new Set())

  // Load test
  useEffect(() => {
    fetch(`/api/tests/${testSetId}`)
      .then((r) => r.json())
      .then((d) => {
        setTestSet(d.testSet)
        setQuestions(d.questions)
        setTimeLeft((d.testSet.durationMin || 30) * 60)
        const init: Record<string, number | null> = {}
        d.questions.forEach((q: Question) => (init[q.id] = null))
        setAnswers(init)
      })
      .finally(() => setLoading(false))
  }, [testSetId])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  // Warning khi còn 5 phút (exam mode)
  useEffect(() => {
    if (isExam && timeLeft === 300 && !showWarning5min) {
      setShowWarning5min(true)
      toast({
        title: '⚠️ Còn 5 phút!',
        description: 'Bạn còn 5 phút để hoàn thành bài thi. Hãy kiểm tra lại các câu chưa trả lời.',
      })
    }
  }, [timeLeft, isExam, showWarning5min, toast])

  const submit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    const durationSec = Math.round((Date.now() - startedAtRef.current) / 1000)
    const payload = {
      learnerId: getLearnerId(user?.id),
      testSetId: testSet?.id,
      testSetTitle: testSet?.title,
      type: testSet?.type || 'mini',
      durationSec,
      answers: questions.map((q) => ({ questionId: q.id, selected: answers[q.id] ?? null })),
    }
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.attemptId) {
        toast({
          title: isExam ? '🎯 Nộp bài thi thành công!' : 'Test submitted!',
          description: `Bạn đúng ${data.correct}/${data.total} câu.`,
        })
        navigate({ name: 'results', attemptId: data.attemptId })
      } else {
        toast({ title: 'Submission failed', description: data.error || 'Unknown error', variant: 'destructive' })
        setSubmitting(false)
      }
    } catch (e: any) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' })
      setSubmitting(false)
    }
  }, [answers, questions, testSet, navigate, toast, submitting, isExam])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !loading && questions.length > 0 && !submitting) {
      toast({
        title: isExam ? '⏰ Hết giờ!' : "Time's up!",
        description: isExam ? 'Bài thi đã được tự động nộp.' : 'Submitting your test automatically.',
      })
      submit()
    }
  }, [timeLeft, loading, questions.length, submit, submitting, toast, isExam])

  // Listening: auto-play TTS audio when entering a listening question (chỉ cho đề không có MP3)
  const playAudio = useCallback((q: Question) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !q.audioScript) return
    // Nếu audioScript chứa "🎧 Phát audio MP3" → không dùng TTS (sẽ dùng MP3 player)
    if (q.audioScript.includes('🎧') || q.audioScript.includes('MP3')) return
    const u = new SpeechSynthesisUtterance(q.audioScript)
    u.lang = 'en-US'
    u.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [])

  useEffect(() => {
    if (questions.length === 0) return
    const q = questions[current]
    if (q && q.part <= 4 && q.audioScript && !playedRef.current.has(q.id)) {
      playedRef.current.add(q.id)
      const t = setTimeout(() => playAudio(q), 300)
      return () => clearTimeout(t)
    }
  }, [current, questions, playAudio])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!testSet || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">This test could not be loaded.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'practice' })}>Back to practice</Button>
      </div>
    )
  }

  const q = questions[current]
  const answeredCount = Object.values(answers).filter((v) => v !== null).length
  const isListening = q.part <= 4
  const lowTime = timeLeft <= 60
  const warningTime = isExam && timeLeft <= 300 && timeLeft > 60
  // Kiểm tra đề có audio MP3 thật không
  const hasMp3Audio = isListening && q.audioScript && (q.audioScript.includes('🎧') || q.audioScript.includes('MP3'))
  const mp3Url = testSet?.id === 'ts_lc1_full' ? '/audio/test_01_listening.mp3' : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* EXAM MODE — Banner cảnh báo */}
      {isExam && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-orange-500/10 p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">🎯 CHẾ ĐỘ THI THẬT — EXAM MODE</p>
            <p className="text-xs text-muted-foreground truncate">
              <EyeOff className="inline h-3 w-3" /> Không xem transcript ·{' '}
              <VolumeX className="inline h-3 w-3" /> Không nghe lại audio ·{' '}
              <ShieldAlert className="inline h-3 w-3" /> Tự nộp khi hết giờ
            </p>
          </div>
        </motion.div>
      )}

      {/* Top bar */}
      <div className="sticky top-16 z-30 mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/90 p-3 backdrop-blur">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Bạn đang làm bài. Quay lại sẽ mất tiến trình. Bạn chắc không?')) {
                navigate({ name: 'practice' })
              }
            }}
            className="gap-1.5 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Quay lại
          </Button>
          <div className="min-w-0 border-l border-border/60 pl-3">
            <p className="truncate text-sm font-semibold" suppressHydrationWarning>{testSet.title}</p>
            <p className="text-xs text-muted-foreground">
            {/* Exam mode: ẩn số câu đã trả lời để tăng căng thẳng */}
            {isExam ? (
              <>Câu {current + 1} / {questions.length} · Hết giờ tự động nộp</>
            ) : (
              <>{answeredCount}/{questions.length} answered</>
            )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums ${
            lowTime
              ? 'bg-rose-500/15 text-rose-600 animate-pulse'
              : warningTime
              ? 'bg-amber-500/15 text-amber-600'
              : 'bg-secondary'
          }`}>
            <Clock className="h-4 w-4" />
            {fmt(timeLeft)}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={submitting} variant={isExam ? 'destructive' : 'default'}>
                <Flag className="mr-1 h-3.5 w-3.5" /> Nộp bài
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{isExam ? '🎯 Nộp bài thi?' : 'Submit your test?'}</AlertDialogTitle>
                <AlertDialogDescription>
                  {isExam ? (
                    <span>
                      Bạn đã trả lời <strong>{answeredCount}</strong> / {questions.length} câu.
                      {answeredCount < questions.length ? (
                        <> Còn <strong>{questions.length - answeredCount}</strong> câu chưa trả lời sẽ bị tính sai.</>
                      ) : null}
                      <br /><br />
                      ⚠️ Sau khi nộp, bạn <strong>không thể làm lại</strong>. Kết quả sẽ hiện ngay.
                    </span>
                  ) : (
                    <span>
                      You have answered {answeredCount} of {questions.length} questions.
                      {answeredCount < questions.length ? ` ${questions.length - answeredCount} unanswered questions will be marked incorrect.` : ' All questions answered.'}
                      This cannot be undone.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{isExam ? 'Tiếp tục làm bài' : 'Keep going'}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={submit}
                  disabled={submitting}
                  className={isExam ? 'bg-rose-600 hover:bg-rose-700' : ''}
                >
                  {submitting ? 'Đang nộp…' : isExam ? 'Nộp bài' : 'Submit now'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        {/* Question area */}
        <div className="space-y-4">
          {/* Passage (Part 6/7) */}
          {q.passage && (
            <Card className="bg-secondary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{q.passage}</pre>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={isListening ? 'secondary' : 'outline'} className="gap-1">
                  {isListening && <Headphones className="h-3 w-3" />}
                  {PART_LABEL[q.part] || `Part ${q.part}`}
                </Badge>
                <span className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Listening audio control */}
              {isListening && q.audioScript && (
                <div className={`rounded-lg border p-3 ${
                  isExam
                    ? 'border-rose-500/30 bg-rose-500/5'
                    : 'border-teal-500/30 bg-teal-500/5'
                }`}>
                  {hasMp3Audio && mp3Url ? (
                    // MP3 AUDIO MODE — Phát file MP3 thật
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                        <Headphones className="h-4 w-4" />
                        <span>🎧 Phát audio MP3 — Lắng nghe và chọn đáp án</span>
                      </div>
                      <audio controls autoPlay className="w-full">
                        <source src={mp3Url} type="audio/mpeg" />
                        Trình duyệt không hỗ trợ audio.
                      </audio>
                      {isExam && (
                        <p className="text-xs text-rose-600">⚠️ Chế độ thi thật: Audio chỉ phát 1 lần, không replay.</p>
                      )}
                    </div>
                  ) : isExam ? (
                    // EXAM MODE TTS: chỉ hiện thông báo
                    <div className="flex items-center gap-2 text-sm text-rose-700 dark:text-rose-400">
                      <Volume2 className="h-4 w-4 animate-pulse" />
                      <span>Audio đang phát <strong>1 lần duy nhất</strong>. Lắng nghe kỹ và chọn đáp án.</span>
                    </div>
                  ) : (
                    // PRACTICE MODE TTS: có replay + transcript
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                          <Volume2 className="h-4 w-4" />
                          <span>Listen to the audio, then choose the best answer.</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => playAudio(q)}>
                          <Volume2 className="mr-1 h-3.5 w-3.5" /> Replay
                        </Button>
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Show transcript</summary>
                        <p className="mt-1 text-sm italic text-muted-foreground">"{q.audioScript}"</p>
                      </details>
                    </>
                  )}
                </div>
              )}

              {/* Part 1: Hiển thị ảnh photograph */}
              {q.part === 1 && q.imagePrompt && q.imagePrompt.startsWith('/') && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <img
                    src={q.imagePrompt}
                    alt="Part 1 photograph"
                    className="w-full max-h-80 object-contain bg-secondary/20"
                  />
                </div>
              )}

              <p className="text-base font-medium leading-relaxed" suppressHydrationWarning>{q.question}</p>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                        selected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-accent/50'
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {selected && <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={submitting} variant={isExam ? 'destructive' : 'default'}>
                    <Flag className="mr-1 h-4 w-4" /> {isExam ? 'Nộp bài thi' : 'Finish & Submit'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{isExam ? '🎯 Nộp bài thi?' : 'Submit your test?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {isExam ? (
                        <span>
                          Bạn đã trả lời <strong>{answeredCount}</strong> / {questions.length} câu.
                          <br />Sau khi nộp, bạn <strong>không thể làm lại</strong>.
                        </span>
                      ) : (
                        <span>You have answered {answeredCount} of {questions.length} questions.</span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isExam ? 'Tiếp tục' : 'Keep going'}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={submit}
                      disabled={submitting}
                      className={isExam ? 'bg-rose-600 hover:bg-rose-700' : ''}
                    >
                      {submitting ? 'Đang nộp…' : isExam ? 'Nộp bài' : 'Submit'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Question palette */}
        <div className="hidden lg:block">
          <Card className="sticky top-32">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Question Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((qq, i) => {
                  const ans = answers[qq.id]
                  return (
                    <button
                      key={qq.id}
                      onClick={() => setCurrent(i)}
                      className={`flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                        i === current
                          ? 'bg-primary text-primary-foreground'
                          : isExam
                          // EXAM: không highlight answered (chỉ current) — tăng căng thẳng
                          ? 'bg-secondary text-muted-foreground hover:bg-accent'
                          : ans !== null && ans !== undefined
                          ? 'bg-primary/15 text-primary'
                          : 'bg-secondary text-muted-foreground hover:bg-accent'
                      }`}
                      aria-label={`Go to question ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {isExam ? (
                  <>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Câu hiện tại</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-secondary" /> Các câu khác</div>
                    <p className="mt-2 italic text-[10px]">Ẩn trạng thái đã trả lời để mô phỏng thi thật</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Current</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary/30" /> Answered</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-secondary" /> Unanswered</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
