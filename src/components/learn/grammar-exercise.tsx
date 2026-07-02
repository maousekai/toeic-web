'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  CheckCircle2, XCircle, RotateCcw, Trophy, PenLine, ChevronRight, ChevronLeft, Target, ListChecks,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Exercise = {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
  order: number
}

type Phase = 'doing' | 'submitted'

export function GrammarExercise({ slug }: { slug: string }) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [phase, setPhase] = useState<Phase>('doing')
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setLoading(true)
    setPhase('doing')
    setAnswers({})
    setCurrent(0)
    fetch(`/api/content/grammar/${slug}/exercises`)
      .then((r) => r.json())
      .then((d) => {
        setExercises(d.exercises || [])
        const init: Record<string, number | null> = {}
        ;(d.exercises || []).forEach((e: Exercise) => (init[e.id] = null))
        setAnswers(init)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const answeredCount = Object.values(answers).filter((v) => v !== null).length
  const correctCount = exercises.filter((e) => answers[e.id] === e.answer).length
  const score = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0

  const handleSubmit = useCallback(() => {
    setPhase('submitted')
    setCurrent(0)
    window.scrollTo({ top: document.getElementById('exercise-section')?.offsetTop || 0, behavior: 'smooth' })
  }, [])

  const reset = () => {
    setPhase('doing')
    const init: Record<string, number | null> = {}
    exercises.forEach((e) => (init[e.id] = null))
    setAnswers(init)
    setCurrent(0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  if (exercises.length === 0) {
    return null
  }

  // ===== SUBMITTED PHASE: Results =====
  if (phase === 'submitted') {
    return (
      <motion.div id="exercise-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Kết quả bài tập</CardTitle>
                  <CardDescription>{correctCount}/{exercises.length} câu đúng · {score}%</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  'text-3xl font-bold tabular-nums',
                  score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
                )}>{score}%</div>
                <Badge variant="secondary" className="mt-1">
                  {score >= 80 ? 'Xuất sắc! 🎉' : score >= 50 ? 'Khá tốt 👍' : 'Cần ôn lại 📚'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Làm lại
            </Button>
          </CardContent>
        </Card>

        {/* Review all answers */}
        <div className="mt-4 space-y-4">
          {exercises.map((ex, i) => {
            const userAns = answers[ex.id]
            const isCorrect = userAns === ex.answer
            const isUnanswered = userAns === null
            return (
              <Card key={ex.id} className={cn(
                isCorrect ? 'border-emerald-500/30' : isUnanswered ? 'border-border' : 'border-rose-500/30'
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">{i + 1}</span>
                      <p className="text-sm font-medium leading-relaxed">{ex.question}</p>
                    </div>
                    {isCorrect ? (
                      <Badge className="shrink-0 bg-emerald-500/15 text-emerald-600 gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Đúng</Badge>
                    ) : isUnanswered ? (
                      <Badge variant="secondary" className="shrink-0 gap-1"><XCircle className="h-3.5 w-3.5" /> Bỏ trống</Badge>
                    ) : (
                      <Badge className="shrink-0 bg-rose-500/15 text-rose-600 gap-1"><XCircle className="h-3.5 w-3.5" /> Sai</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ex.options.map((opt, oi) => {
                    const isAns = oi === ex.answer
                    const isSel = oi === userAns
                    return (
                      <div key={oi} className={cn(
                        'flex items-start gap-2.5 rounded-lg border p-2.5 text-sm',
                        isAns ? 'border-emerald-500/50 bg-emerald-500/5' : isSel ? 'border-rose-500/50 bg-rose-500/5' : 'border-border'
                      )}>
                        <span className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                          isAns ? 'bg-emerald-500 text-white' : isSel ? 'bg-rose-500 text-white' : 'bg-secondary text-muted-foreground'
                        )}>{String.fromCharCode(65 + oi)}</span>
                        <span className="flex-1">{opt}</span>
                        {isAns && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />}
                        {isSel && !isAns && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
                      </div>
                    )
                  })}
                  {/* Explanation */}
                  <div className="mt-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-xs"><span className="font-semibold text-primary">💡 Giải thích: </span>{ex.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Button onClick={reset} className="mt-6 w-full" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" /> Làm lại bài tập
        </Button>
      </motion.div>
    )
  }

  // ===== DOING PHASE: One question at a time =====
  const ex = exercises[current]
  const isLast = current === exercises.length - 1

  return (
    <div id="exercise-section">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PenLine className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Bài tập ngữ pháp
                    <Badge variant="secondary" className="text-[10px]">{exercises.length} câu</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">Làm hết các câu rồi bấm "Nộp bài" để xem điểm + lời giải</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Đã trả lời</div>
                <div className="text-lg font-bold tabular-nums text-primary">{answeredCount}/{exercises.length}</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Progress bar */}
      <div className="mt-3 flex gap-1">
        {exercises.map((q, i) => {
          const ans = answers[q.id]
          return (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i === current ? 'bg-primary' : ans !== null ? 'bg-primary/30' : 'bg-secondary'
              )}
              aria-label={`Câu ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Question card */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="gap-1">
              <ListChecks className="h-3 w-3" /> Câu {current + 1}/{exercises.length}
            </Badge>
            {answers[ex.id] !== null && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> Đã trả lời
              </Badge>
            )}
          </div>
          <CardTitle className="text-base font-medium leading-relaxed pt-2">{ex.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {ex.options.map((opt, i) => {
            const selected = answers[ex.id] === i
            return (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [ex.id]: i }))}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                  selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/40 hover:bg-accent/50'
                )}
              >
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                )}>{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{opt}</span>
                {selected && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Câu trước
        </Button>

        <div className="flex items-center gap-1.5">
          {answeredCount === exercises.length ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 gap-1">
              <Target className="h-3 w-3" /> Đã hoàn thành!
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              Còn {exercises.length - answeredCount} câu chưa trả lời
            </span>
          )}
        </div>

        {isLast ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={answeredCount === 0}>
                <Trophy className="mr-1.5 h-4 w-4" /> Nộp bài
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Nộp bài tập?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn đã trả lời <strong>{answeredCount}</strong> / {exercises.length} câu.
                  {answeredCount < exercises.length ? (
                    <> Còn <strong>{exercises.length - answeredCount}</strong> câu chưa trả lời sẽ bị tính sai.</>
                  ) : null}
                  <br />Sau khi nộp, bạn sẽ xem được điểm số + lời giải chi tiết từng câu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Tiếp tục làm</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={() => setCurrent((c) => Math.min(exercises.length - 1, c + 1))}>
            Câu tiếp <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
