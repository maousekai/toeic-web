'use client'

import { useEffect, useState } from 'react'
import { Clock, FileText, Headphones, Layers, Play, ArrowRight, Trophy, AlertTriangle, ShieldCheck, VolumeX, EyeOff, Timer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion } from 'framer-motion'

type TestSet = {
  id: string
  title: string
  description: string
  durationMin: number
  type: string
  questionCount: number
}

const TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  exam: { icon: Trophy, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', label: '🎯 Thi Thật' },
  full: { icon: Trophy, color: 'bg-primary/10 text-primary', label: 'Full Mock' },
  listening: { icon: Headphones, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', label: 'Listening' },
  part5: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 5' },
  part6: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 6' },
  part7: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 7' },
  mini: { icon: Layers, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', label: 'Mini' },
}

export function PracticeList() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const [tests, setTests] = useState<TestSet[]>([])
  const [loading, setLoading] = useState(true)
  const [examDialog, setExamDialog] = useState<TestSet | null>(null)

  useEffect(() => {
    fetch('/api/tests')
      .then((r) => r.json())
      .then((d) => setTests(d.testSets || []))
      .finally(() => setLoading(false))
  }, [])

  const startTest = (test: TestSet) => {
    if (!user) {
      openAuth('login', () => navigate({ name: 'test', testSetId: test.id, mode: test.type === 'exam' ? 'exam' : 'practice' }))
      return
    }
    // Nếu là exam → mở dialog nội quy trước
    if (test.type === 'exam') {
      setExamDialog(test)
      return
    }
    navigate({ name: 'test', testSetId: test.id, mode: 'practice' })
  }

  const confirmStartExam = () => {
    if (!examDialog) return
    navigate({ name: 'test', testSetId: examDialog.id, mode: 'exam' })
    setExamDialog(null)
  }

  const examTests = tests.filter((t) => t.type === 'exam')
  const practiceTests = tests.filter((t) => t.type !== 'exam')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Luyện Thi TOEIC</h1>
        <p className="mt-2 text-muted-foreground">
          Chọn bộ đề phù hợp với mục tiêu của bạn. Có 2 chế độ: <strong>luyện tập</strong> (xem transcript, nghe lại)
          và <strong>thi thật</strong> (mô phỏng phòng thi, nghiêm ngặt).
        </p>
      </div>

      {/* EXAM MODE — Section nổi bật ở trên */}
      {examTests.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🎯 Chế độ Thi Thật (Exam Simulation)</h2>
              <p className="text-xs text-muted-foreground">Mô phỏng phòng thi TOEIC thật — làm nghiêm túc để đánh giá chính xác năng lực</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {examTests.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group relative overflow-hidden border-rose-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/5 via-orange-500/5 to-transparent" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="gap-1 bg-rose-500/10 text-rose-600">
                        <Timer className="h-3 w-3" /> {t.durationMin} phút
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{t.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Nội quy thi */}
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" /> Nội quy phòng thi:
                      </p>
                      <ul className="space-y-1 text-[11px] text-muted-foreground">
                        <li className="flex items-start gap-1.5"><EyeOff className="mt-0.5 h-3 w-3 shrink-0" /> KHÔNG xem transcript khi đang làm</li>
                        <li className="flex items-start gap-1.5"><VolumeX className="mt-0.5 h-3 w-3 shrink-0" /> KHÔNG nghe lại audio (chỉ 1 lần)</li>
                        <li className="flex items-start gap-1.5"><Timer className="mt-0.5 h-3 w-3 shrink-0" /> Đồng hồ đếm ngược nghiêm ngặt</li>
                        <li className="flex items-start gap-1.5"><ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" /> Tự nộp khi hết giờ</li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.questionCount} câu</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.durationMin} phút</span>
                      </div>
                      <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => startTest(t)}>
                        <Trophy className="mr-1 h-3.5 w-3.5" /> Vào phòng thi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* PRACTICE MODE — Section dưới */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold">📚 Chế độ Luyện Tập (Practice Mode)</h2>
          <p className="text-xs text-muted-foreground">Tự do luyện từng part — có transcript, nghe lại, xem gợi ý</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {practiceTests.map((t) => {
            const meta = TYPE_META[t.type] || TYPE_META.mini
            return (
              <Card key={t.id} className="group flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.color}`}>
                      <meta.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{meta.label}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{t.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.questionCount} Q</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.durationMin} min</span>
                  </div>
                  <Button size="sm" onClick={() => startTest(t)}>
                    <Play className="mr-1 h-3.5 w-3.5" /> Start
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="mt-8 border-dashed bg-secondary/20">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowRight className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Muốn luyện thêm câu hỏi mới?</h3>
            <p className="text-sm text-muted-foreground">Dùng AI Question Generator để tạo câu hỏi theo chủ đề bạn muốn.</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ name: 'tools' })}>Mở AI Tools</Button>
        </CardContent>
      </Card>

      {/* DIALOG NỘI QUY THI THẬT */}
      <AlertDialog open={!!examDialog} onOpenChange={(o) => !o && setExamDialog(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
              <Trophy className="h-7 w-7" />
            </div>
            <AlertDialogTitle className="text-xl">🎯 Vào phòng thi TOEIC</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p>
                  Bạn sắp vào phòng thi thật. Vui lòng đọc kỹ nội quy trước khi bắt đầu:
                </p>
                <div className="rounded-lg border border-border bg-secondary/30 p-3">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span><strong>KHÔNG xem transcript</strong> khi đang làm bài (chỉ xem sau khi nộp)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <VolumeX className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span><strong>KHÔNG nghe lại audio</strong> — mỗi câu listening chỉ phát 1 lần</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Timer className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span><strong>Đồng hồ đếm ngược {examDialog?.durationMin} phút</strong> — không gia hạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>Khi hết giờ, bài sẽ <strong>tự động nộp</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Layers className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>Tổng <strong>{examDialog?.questionCount} câu hỏi</strong> — {examDialog?.durationMin} phút</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                  <p className="font-semibold text-amber-700 dark:text-amber-400">💡 Khuyến nghị:</p>
                  <p className="mt-1 text-muted-foreground">
                    Tìm chỗ yên tĩnh, tắt thông báo điện thoại, chuẩn bị bút giấy.
                    Làm nghiêm túc như thi thật để đánh giá chính xác năng lực.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Chưa sẵn sàng</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartExam}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Trophy className="mr-1.5 h-4 w-4" /> Bắt đầu thi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
