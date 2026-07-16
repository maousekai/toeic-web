'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Volume2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Layers, Brain,
  Sparkles, TrendingUp, PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/site/back-button'
import { useAuth } from '@/lib/auth/use-auth'

// Định nghĩa kiểu dữ liệu cho một từ vựng (Vocab)
type Vocab = {
  id: string
  word: string
  phonetic: string | null
  partOfSpeech: string
  definition: string
  example: string
  translation: string | null
  category: string
  level: string
  difficulty: number
}

// Cấu hình các cấp độ từ vựng theo khung tham chiếu ngôn ngữ chung Châu Âu (CEFR)
const LEVELS = [
  { code: 'A0', name: 'Pre-Beginner', vn: 'Tiền sơ cấp', color: 'from-slate-400 to-slate-500', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', desc: 'Từ vựng cơ bản nhất: số, màu, ngày, gia đình' },
  { code: 'A1', name: 'Beginner', vn: 'Sơ cấp', color: 'from-emerald-400 to-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', desc: 'Giao tiếp cơ bản, đời sống hàng ngày' },
  { code: 'A2', name: 'Elementary', vn: 'Sơ trung cấp', color: 'from-teal-400 to-teal-500', badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', desc: 'Du lịch, mua sắm, giao tiếp xã hội' },
  { code: 'B1', name: 'Intermediate', vn: 'Trung cấp', color: 'from-cyan-400 to-cyan-500', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', desc: 'TOEIC 400-600 · Business English cơ bản' },
  { code: 'B2', name: 'Upper-Intermediate', vn: 'Trung cao cấp', color: 'from-amber-400 to-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', desc: 'TOEIC 600-750 · Đàm phán, tài chính' },
  { code: 'C1', name: 'Advanced', vn: 'Cao cấp', color: 'from-orange-400 to-orange-500', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', desc: 'TOEIC 750-900 · Business/academic nâng cao' },
  { code: 'C2', name: 'Mastery', vn: 'Thành thạo', color: 'from-rose-400 to-rose-500', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', desc: 'TOEIC 900+ · Từ vựng chuyên sâu, trang trọng' },
] as const

// Quản lý trạng thái Ôn tập gián đoạn (Spaced Repetition - SR) cho người dùng ẩn danh qua localStorage
type SRState = Record<string, { box: number; due: number }>
const BOX_INTERVALS = [0, 1, 2, 5, 5, 5] // Số ngày giãn cách tương ứng với từng hộp (hộp càng cao thời gian ôn tập lại càng lâu)
const STORAGE_KEY = 'toeic_sr_v2'

// Tải trạng thái SR từ localStorage của trình duyệt
function loadSR(): SRState {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

// Lưu trạng thái SR mới vào localStorage của trình duyệt
function saveSR(s: SRState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

// ==========================================
// GHI CHÚ: Component chính thực hiện học từ vựng qua thẻ Flashcard chuẩn học thuật
// ==========================================
export function VocabFlashcards() {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [selectedLevel, setSelectedLevel] = useState<string>('A0')
  const [allVocabs, setAllVocabs] = useState<Vocab[]>([]) // Danh sách toàn bộ từ vựng thuộc cấp độ đã chọn
  const [dueVocabs, setDueVocabs] = useState<Vocab[]>([]) // Danh sách từ vựng cần ôn tập hoặc chưa thuộc
  const [counts, setCounts] = useState<Record<string, number>>({}) // Đếm tổng số từ vựng của từng cấp độ
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0) // Vị trí thẻ từ vựng hiện tại đang hiển thị
  const [flipped, setFlipped] = useState(false) // Trạng thái lật thẻ (Mặt trước/Mặt sau)
  const [sr, setSr] = useState<SRState>({}) // Trạng thái ôn tập gián đoạn của người dùng ẩn danh
  const [knownCount, setKnownCount] = useState(0) // Số từ vựng đã ghi nhớ thành công
  const [grading, setGrading] = useState(false) // Cờ chặn việc nhấp chuột liên tục khi đánh giá từ
  const masteredIdsRef = useRef<Set<string>>(new Set())

  // Tải thống kê tổng số lượng từ vựng của từng cấp độ từ API
  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/content/vocab/counts')
      const data = await res.json()
      setCounts(data.counts || {})
    } catch {}
  }, [])

  // Khôi phục dữ liệu tiến trình học từ Server (nếu đã đăng nhập) hoặc từ LocalStorage (nếu là khách)
  const fetchProgress = useCallback(async (level: string): Promise<Set<string>> => {
    if (isAuthenticated && user) {
      try {
        const res = await fetch(`/api/content/vocab/progress?level=${level}`)
        const data = await res.json()
        setKnownCount(data.knownCount || 0)
        return new Set(data.masteredIds || [])
      } catch {
        return new Set()
      }
    } else {
      const srData = loadSR()
      const now = Date.now()
      const mastered = new Set<string>()
      let known = 0
      for (const [vocabId, state] of Object.entries(srData)) {
        if (state.box > 0) known++
        if (state.box > 0 && state.due > now) {
          mastered.add(vocabId)
        }
      }
      setKnownCount(known)
      return mastered
    }
  }, [isAuthenticated, user])

  // Lấy danh sách từ vựng của cấp độ được chọn và lọc bỏ những từ đã thuộc hoàn toàn
  const fetchVocab = useCallback(async (level: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/vocab?level=${level}`)
      const data = await res.json()
      const vocabs: Vocab[] = data.vocabs || []
      setAllVocabs(vocabs)

      const mastered = await fetchProgress(level)
      masteredIdsRef.current = mastered
      const due = vocabs.filter((v) => !mastered.has(v.id))
      setDueVocabs(due)
      setIdx(0)
      setFlipped(false)
    } catch {
      setAllVocabs([])
      setDueVocabs([])
    }
    setLoading(false)
  }, [fetchProgress])

  useEffect(() => { setSr(loadSR()) }, [])
  useEffect(() => { fetchCounts() }, [fetchCounts])
  useEffect(() => { fetchVocab(selectedLevel) }, [selectedLevel, fetchVocab])

  const current = dueVocabs[idx]

  // Sử dụng thư viện giọng nói tích hợp sẵn của trình duyệt (Speech Synthesis) để phát âm từ vựng tiếng Anh
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  // Ghi nhận kết quả học ("Đã thuộc" hoặc "Chưa thuộc") và cập nhật khoảng thời gian lặp lại của từ vựng
  const grade = async (known: boolean) => {
    if (!current || grading) return
    setGrading(true)

    try {
      if (isAuthenticated && user) {
        const res = await fetch('/api/content/vocab/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vocabId: current.id, known }),
        })
        const data = await res.json()
        const box = data.progress?.box ?? 0
        const intervalDays = data.progress?.intervalDays ?? 0

        toast({
          title: known ? '✅ Đã ghi nhớ' : '🔄 Sẽ ôn lại sớm',
          description: known
            ? `Ôn lại sau ${intervalDays} ngày`
            : 'Từ này sẽ hiện lại ngay để bạn ôn tập',
        })

        if (known) {
          setKnownCount((c) => c + 1)
          setDueVocabs((prev) => {
            const next = prev.filter((v) => v.id !== current.id)
            if (idx >= next.length && next.length > 0) {
              setIdx(0)
            }
            return next
          })
        } else {
          setIdx((i) => (i + 1) % Math.max(dueVocabs.length, 1))
        }
      } else {
        const newSr = { ...sr }
        const cur = newSr[current.id] || { box: 0, due: 0 }
        let box = cur.box
        if (known) box = Math.min(box + 1, BOX_INTERVALS.length - 1)
        else box = 0
        const intervalDays = BOX_INTERVALS[box]
        newSr[current.id] = { box, due: Date.now() + intervalDays * 86400000 }
        setSr(newSr)
        saveSR(newSr)

        toast({
          title: known ? '✅ Đã ghi nhớ' : '🔄 Sẽ ôn lại sớm',
          description: known
            ? `Ôn lại sau ${intervalDays} ngày`
            : 'Từ này sẽ hiện lại ngay để bạn ôn tập',
        })

        if (known) {
          setKnownCount((c) => c + 1)
          setDueVocabs((prev) => {
            const next = prev.filter((v) => v.id !== current.id)
            if (idx >= next.length && next.length > 0) {
              setIdx(0)
            }
            return next
          })
        } else {
          setIdx((i) => (i + 1) % Math.max(dueVocabs.length, 1))
        }
      }
    } finally {
      setFlipped(false)
      setGrading(false)
    }
  }

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % Math.max(dueVocabs.length, 1)) }
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + dueVocabs.length) % Math.max(dueVocabs.length, 1)) }

  const levelConfig = LEVELS.find((l) => l.code === selectedLevel)!

  return (
    <div className="space-y-6">
      <BackButton targetView={{ name: 'learn' }} label="Trung tâm học tập" />
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Từ vựng TOEIC theo cấp độ</h2>
        <p className="text-sm text-muted-foreground">
          Học từ vựng theo chuẩn CEFR (A0 → C2) — lật thẻ, nghe phát âm, ôn tập gián đoạn.
        </p>
      </div>

      {/* Level selector — beautiful cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {LEVELS.map((level) => {
          const active = level.code === selectedLevel
          const count = counts[level.code] || 0
          return (
            <button
              key={level.code}
              onClick={() => setSelectedLevel(level.code)}
              className={cn(
                'group relative overflow-hidden rounded-xl border p-3 text-left transition-all',
                active
                  ? 'border-primary shadow-md scale-[1.02]'
                  : 'border-border hover:border-primary/40 hover:shadow-sm'
              )}
            >
              {active && (
                <div className={cn('absolute inset-0 -z-10 bg-gradient-to-br opacity-10', level.color)} />
              )}
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-lg font-bold',
                  active ? 'text-primary' : 'text-foreground'
                )}>{level.code}</span>
                <Badge variant="secondary" className="text-[9px]">{count}</Badge>
              </div>
              <div className="mt-0.5 text-[10px] font-medium text-muted-foreground line-clamp-1">
                {level.vn}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected level info */}
      <Card className={cn('border-l-4 overflow-hidden', levelConfig.badge)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={cn('bg-gradient-to-r bg-clip-text text-transparent font-bold text-lg', levelConfig.color)}>
                  {levelConfig.code}
                </span>
                <span className="text-sm font-semibold">{levelConfig.vn}</span>
                <span className="text-xs text-muted-foreground">· {levelConfig.name}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{levelConfig.desc}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Layers className="h-3.5 w-3.5" /> {allVocabs.length} từ
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Brain className="h-3.5 w-3.5" /> {knownCount} đã thuộc
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      {loading ? (
        <Card><CardContent className="flex h-72 items-center justify-center text-muted-foreground">Đang tải từ vựng...</CardContent></Card>
      ) : allVocabs.length === 0 ? (
        <Card><CardContent className="flex h-72 items-center justify-center text-muted-foreground">Chưa có từ vựng cho cấp độ này.</CardContent></Card>
      ) : dueVocabs.length === 0 ? (
        /* All words mastered for this level */
        <Card>
          <CardContent className="flex flex-col h-72 items-center justify-center gap-4 text-center">
            <PartyPopper className="h-12 w-12 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                🎉 Chúc mừng! Bạn đã thuộc tất cả từ vựng!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {knownCount}/{allVocabs.length} từ đã thuộc ở level {selectedLevel}.
                <br />Các từ sẽ tự động hiện lại khi đến hạn ôn tập.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchVocab(selectedLevel)}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Kiểm tra lại
            </Button>
          </CardContent>
        </Card>
      ) : current ? (
        <>
          {/* Progress + counter */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" /> Câu {idx + 1} / {dueVocabs.length}
            </Badge>
            <div className="flex-1 mx-4">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((idx + 1) / dueVocabs.length) * 100}%` }}
                />
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> {Math.round(((idx + 1) / dueVocabs.length) * 100)}%
            </Badge>
          </div>

          {/* Flip card */}
          <div
            className="flip-card h-80 w-full cursor-pointer"
            onClick={() => setFlipped((f) => !f)}
            style={{ perspective: '1200px' }}
          >
            <div
              className="flip-card-inner relative h-full w-full transition-transform duration-500"
              style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className={cn('mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', levelConfig.badge)}>
                  <span className="font-bold">{current.level}</span> · {current.category}
                </div>
                <div className="text-4xl font-bold sm:text-5xl">{current.word}</div>
                {current.phonetic && <div className="mt-2 text-sm text-muted-foreground">{current.phonetic}</div>}
                <div className="mt-1 text-xs italic text-primary">{current.partOfSpeech}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.word) }}
                  className="mt-4 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                  aria-label="Phát âm"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <p className="mt-4 text-[10px] text-muted-foreground">👆 Click thẻ để lật xem nghĩa</p>
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-secondary/40 p-6 text-center shadow-sm"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-base font-medium text-primary">{current.definition}</div>
                {current.translation && (
                  <div className="mt-1.5 text-sm text-muted-foreground">→ {current.translation}</div>
                )}
                <div className="mt-3 max-h-24 overflow-y-auto scrollbar-thin text-sm italic text-muted-foreground">
                  "{current.example}"
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.example) }}
                  className="mt-3 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                  aria-label="Phát âm ví dụ"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Câu trước">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 gap-2">
              <Button
                variant="outline"
                className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20"
                onClick={() => grade(false)}
                disabled={grading}
              >
                <X className="mr-1.5 h-4 w-4" /> Chưa thuộc
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20"
                onClick={() => grade(true)}
                disabled={grading}
              >
                <Check className="mr-1.5 h-4 w-4" /> Đã thuộc
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Câu tiếp">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="mx-auto block" onClick={() => { setIdx(0); setFlipped(false); fetchVocab(selectedLevel) }}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Học lại từ đầu
          </Button>
        </>
      ) : null}
    </div>
  )
}