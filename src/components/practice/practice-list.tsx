'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Clock, FileText, Headphones, Layers, Play, ArrowRight, Trophy, AlertTriangle,
  ShieldCheck, VolumeX, EyeOff, Timer, BookOpen, ExternalLink, CheckCircle2, Volume2,
  Crown, Lock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion } from 'framer-motion'
import { ETS_EXAMS, type EtsResource } from '@/data/ets-exams'
import { EtsExamModal } from './ets-exam-modal'
import Image from 'next/image'

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
  const { toast } = useToast()
  const [tests, setTests] = useState<TestSet[]>([])
  const [loading, setLoading] = useState(true)
  const [examDialog, setExamDialog] = useState<TestSet | null>(null)
  const [etsExam, setEtsExam] = useState<EtsResource | null>(null)
  const [isVip, setIsVip] = useState(false)
  const [vipChecked, setVipChecked] = useState(false)

  // VIP test IDs — require VIP to access
  const VIP_TEST_IDS = ['ts_rc1_full', 'ts_rc2_full', 'ts_rc3_full', 'ts_lc1_full']

  // Check VIP status
  const checkVip = useCallback(async () => {
    if (!user) { setVipChecked(true); return }
    try {
      const res = await fetch('/api/vip/status')
      const d = await res.json().catch(() => ({}))
      setIsVip(!!d.isVip || user.role === 'ADMIN' || user.role === 'TEACHER')
    } catch {
      setIsVip(false)
    } finally {
      setVipChecked(true)
    }
  }, [user])

  useEffect(() => {
    fetch('/api/tests')
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setTests(d.testSets || []))
      .finally(() => setLoading(false))
    checkVip()
  }, [checkVip])

  const isVipTest = (testId: string) => VIP_TEST_IDS.includes(testId)

  const startTest = (test: TestSet) => {
    if (!user) {
      openAuth('login', () => navigate({ name: 'test', testSetId: test.id, mode: test.type === 'exam' ? 'exam' : 'practice' }))
      return
    }
    // VIP gate for full Reading/Listening tests
    if (isVipTest(test.id) && !isVip) {
      toast({
        title: '🔒 Cần gói VIP',
        description: 'Đề thi đầy đủ (100 câu Listening + 3 đề Reading) chỉ dành cho thành viên VIP. Các đề luyện tập bên dưới vẫn miễn phí.',
        variant: 'destructive',
      })
      setTimeout(() => navigate({ name: 'vip' }), 1500)
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
  // Đề Reading đầy đủ (Test 1, Test 2...) — ưu tiên hiển thị lên đầu
  const fullReadingTests = tests.filter((t) => t.id === 'ts_rc1_full' || t.id === 'ts_rc2_full' || t.id === 'ts_rc3_full')
  const listeningTests = tests.filter((t) => t.id === 'ts_lc1_full')
  const practiceTests = tests.filter((t) => t.type !== 'exam' && t.id !== 'ts_rc1_full' && t.id !== 'ts_rc2_full' && t.id !== 'ts_rc3_full' && t.id !== 'ts_lc1_full')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Luyện Thi TOEIC</h1>
        <p className="mt-2 text-muted-foreground">
          Chọn bộ đề phù hợp với mục tiêu của bạn. Có 2 chế độ: <strong>luyện tập</strong> (xem transcript, nghe lại)
          và <strong>thi thật</strong> (mô phỏng phòng thi, nghiêm ngặt).
        </p>
      </div>

      {/* ĐỀ LISTING ĐẦY ĐỦ — Section đầu tiên */}
      {listeningTests.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-600">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                🎧 Đề TOEIC Listening (Audio MP3 thật)
                <Badge className="gap-1 bg-amber-500/15 text-amber-600"><Crown className="h-3 w-3" /> VIP</Badge>
              </h2>
              <p className="text-xs text-muted-foreground">Đề thi thật TOEIC Listening — Parts 1-4 với file audio MP3 (cần VIP)</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listeningTests.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Card className="group relative overflow-hidden border-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                  {/* Header image — Đổi h-32 thành aspect-video và tăng độ sáng cho nền */}
                  <div className="relative aspect-video w-full overflow-hidden bg-teal-500/5">
                    <Image
                      src="/images/practice/listening.jpg"
                      alt="Listening test"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      // Đổi sang object-cover để phủ đều khung hình
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* XÓA lớp phủ từ teal-900/80 cũ, thay bằng lớp phủ trong suốt siêu nhẹ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
                        <Headphones className="h-5 w-5" />
                      </div>
                      {/* Đổi bg-white/95 thành bg-background/95 để tự động đổi màu nền theo giao diện */}
                      <Badge className="gap-1 bg-background/95 text-teal-600 shadow-md backdrop-blur hover:bg-background/95">
                        <Clock className="h-3 w-3" /> {t.durationMin}'
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 1 (6 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 2 (25 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 3 (39 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 4 (30 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Volume2 className="h-3 w-3" /> Audio MP3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.questionCount} câu</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.durationMin} phút</span>
                      </div>
                      {isVip ? (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => startTest(t)}>
                          <Play className="mr-1 h-3.5 w-3.5" /> Bắt đầu
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15" onClick={() => startTest(t)}>
                          <Lock className="h-3.5 w-3.5" /> VIP
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}



            {/* NHÂN BẢN THÊM CARD TEST 2 NẾU CHỈ CÓ 1 ĐỀ THẬT */}
            {listeningTests.length === 1 && (
              <>
                {/* Test 2 Clone */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                  <Card className="group relative overflow-hidden border-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-video w-full overflow-hidden bg-teal-500/5">
                      <Image
                        src="/images/practice/listening.jpg"
                        alt="Listening test"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
                          <Headphones className="h-5 w-5" />
                        </div>
                        <Badge className="gap-1 bg-background/95 text-teal-600 shadow-md backdrop-blur hover:bg-background/95">
                          <Clock className="h-3 w-3" /> {listeningTests[0].durationMin}'
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">🎧 Đề TOEIC Listening Test 2 (100 câu · 45 phút)</CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">{listeningTests[0].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 1 (6 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 2 (25 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 3 (39 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 4 (30 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Volume2 className="h-3 w-3" /> Audio MP3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {listeningTests[0].questionCount} câu</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {listeningTests[0].durationMin} phút</span>
                        </div>
                        {isVip ? (
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => startTest(listeningTests[0])}>
                            <Play className="mr-1 h-3.5 w-3.5" /> Bắt đầu
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15" onClick={() => startTest(listeningTests[0])}>
                            <Lock className="h-3.5 w-3.5" /> VIP
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Test 3 Clone */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                  <Card className="group relative overflow-hidden border-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-video w-full overflow-hidden bg-teal-500/5">
                      <Image
                        src="/images/practice/listening.jpg"
                        alt="Listening test"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
                          <Headphones className="h-5 w-5" />
                        </div>
                        <Badge className="gap-1 bg-background/95 text-teal-600 shadow-md backdrop-blur hover:bg-background/95">
                          <Clock className="h-3 w-3" /> {listeningTests[0].durationMin}'
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">🎧 Đề TOEIC Listening Test 3 (100 câu · 45 phút)</CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">{listeningTests[0].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 1 (6 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 2 (25 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 3 (39 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Part 4 (30 câu)</Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Volume2 className="h-3 w-3" /> Audio MP3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {listeningTests[0].questionCount} câu</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {listeningTests[0].durationMin} phút</span>
                        </div>
                        {isVip ? (
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => startTest(listeningTests[0])}>
                            <Play className="mr-1 h-3.5 w-3.5" /> Bắt đầu
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15" onClick={() => startTest(listeningTests[0])}>
                            <Lock className="h-3.5 w-3.5" /> VIP
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}


          </div>
        </div>
      )}



      {/* ĐỀ READING ĐẦY ĐỦ — Section ưu tiên hiển thị đầu trang */}
      {fullReadingTests.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                📖 Đề TOEIC Reading Đầy Đủ (100 câu)
                <Badge className="gap-1 bg-amber-500/15 text-amber-600"><Crown className="h-3 w-3" /> VIP</Badge>
              </h2>
              <p className="text-xs text-muted-foreground">Đề thi thật TOEIC Reading — Part 5, 6, 7 với 100 câu hỏi + giải thích chi tiết (cần VIP)</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fullReadingTests.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group relative overflow-hidden border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                  {/* Header image — Đổi h-32 thành aspect-video */}
                  <div className="relative aspect-video w-full overflow-hidden bg-primary/5">
                    <Image
                      src="/images/practice/readingnew.jpg"
                      alt="Reading test"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      // Đổi sang object-cover để phủ đều khung hình
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* XÓA lớp phủ từ emerald-900/80 cũ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                        <FileText className="h-5 w-5" />
                      </div>
                      {/* Đổi bg-white/95 thành bg-background/95 để đồng bộ giao diện sáng tối */}
                      <Badge className="gap-1 bg-background/95 text-primary shadow-md backdrop-blur hover:bg-background/95">
                        <Clock className="h-3 w-3" /> {t.durationMin}'
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> Part 5 (30 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> Part 6 (16 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> Part 7 (54 câu)</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><CheckCircle2 className="h-3 w-3" /> Giải thích VN</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.questionCount} câu</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.durationMin} phút</span>
                      </div>
                      {isVip ? (
                        <Button size="sm" onClick={() => startTest(t)}>
                          <Play className="mr-1 h-3.5 w-3.5" /> Bắt đầu
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15" onClick={() => startTest(t)}>
                          <Lock className="h-3.5 w-3.5" /> VIP
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

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

      {/* ETS EXAMS — Section giữa (đề thật từ Google Drive) */}
      {ETS_EXAMS.length > 0 && (
        <div className="mb-10 mt-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold">📚 Đề ETS TOEIC (từ Google Drive)</h2>
              <p className="text-xs text-muted-foreground">Bộ đề ETS chính thức — xem đề + nghe audio + tải đáp án ngay trên web</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ETS_EXAMS.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group relative overflow-hidden border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Layers className="h-3 w-3" /> {exam.tests.length} tests
                        </Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <Clock className="h-3 w-3" /> {exam.durationMin}'
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {exam.difficulty === 'easy' ? 'Dễ' : exam.difficulty === 'medium' ? 'TB' : 'Khó'}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="mt-3 flex items-center gap-2 text-base">
                      {exam.title}
                      <Badge variant="outline" className="text-[10px]">ETS {exam.year}</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed line-clamp-3">{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Test list preview */}
                    {exam.tests.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {exam.tests.slice(0, 6).map((t) => (
                          <Badge key={t.id} variant="outline" className="text-[10px] py-0.5">
                            {t.label}
                          </Badge>
                        ))}
                        {exam.tests.length > 6 && (
                          <Badge variant="outline" className="text-[10px] py-0.5">
                            +{exam.tests.length - 6}
                          </Badge>
                        )}
                      </div>
                    )}
                    {/* Resource chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> Listening</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> Reading</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><Layers className="h-3 w-3" /> Audio</Badge>
                      <Badge variant="secondary" className="gap-1 text-[10px]"><CheckCircle2 className="h-3 w-3" /> Đáp án</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={() => setEtsExam(exam)}>
                        <BookOpen className="mr-1 h-3.5 w-3.5" /> Xem đề
                      </Button>
                      {exam.driveUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={exam.driveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            📚 Chế độ Luyện Tập (Practice Mode)
            <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-3 w-3" /> FREE</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">Tự do luyện từng part — có transcript, nghe lại, xem gợi ý (miễn phí, không cần VIP)</p>
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

      {/* ETS EXAM MODAL — Xem đề + audio + đáp án */}
      <EtsExamModal
        exam={etsExam}
        open={!!etsExam}
        onOpenChange={(v) => !v && setEtsExam(null)}
      />
    </div>
  )
}
