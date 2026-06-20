'use client'

import { useEffect, useState, useCallback } from 'react'
import { Volume2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Layers, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

type Vocab = {
  id: string
  word: string
  phonetic: string | null
  partOfSpeech: string
  definition: string
  example: string
  translation: string | null
  category: string
  difficulty: number
}

// Simple spaced-repetition boxes stored locally
type SRState = Record<string, { box: number; due: number }>

function loadSR(): SRState {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('toeic_sr') || '{}') } catch { return {} }
}
function saveSR(s: SRState) {
  localStorage.setItem('toeic_sr', JSON.stringify(s))
}

const BOX_INTERVALS = [0, 1, 2, 4, 7, 14] // days

export function VocabFlashcards() {
  const { toast } = useToast()
  const [vocabs, setVocabs] = useState<Vocab[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sr, setSr] = useState<SRState>({})

  const fetchVocab = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/content/vocab?category=${category}`)
    const data = await res.json()
    setVocabs(data.vocabs || [])
    setIdx(0)
    setFlipped(false)
    setLoading(false)
  }, [category])

  useEffect(() => { setSr(loadSR()) }, [])
  useEffect(() => { fetchVocab() }, [fetchVocab])

  const current = vocabs[idx]

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const grade = (known: boolean) => {
    if (!current) return
    const newSr = { ...sr }
    const cur = newSr[current.id] || { box: 0, due: 0 }
    let box = cur.box
    if (known) box = Math.min(box + 1, BOX_INTERVALS.length - 1)
    else box = Math.max(box - 1, 0)
    const intervalDays = BOX_INTERVALS[box]
    newSr[current.id] = { box, due: Date.now() + intervalDays * 86400000 }
    setSr(newSr)
    saveSR(newSr)
    toast({
      title: known ? 'Marked as known' : 'Will review sooner',
      description: known ? `Box ${box + 1}/${BOX_INTERVALS.length}` : `Moved to box ${box + 1}`,
    })
    setFlipped(false)
    setTimeout(() => setIdx((i) => (i + 1) % Math.max(vocabs.length, 1)), 150)
  }

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % Math.max(vocabs.length, 1)) }
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + vocabs.length) % Math.max(vocabs.length, 1)) }

  const knownCount = Object.values(sr).filter((s) => s.box >= 4).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vocabulary Flashcards</h2>
          <p className="text-sm text-muted-foreground">Flip cards, listen to pronunciation, and use spaced repetition to remember.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Badge variant="secondary" className="gap-1.5"><Layers className="h-3.5 w-3.5" /> {vocabs.length} cards</Badge>
        <Badge variant="secondary" className="gap-1.5"><Brain className="h-3.5 w-3.5" /> {knownCount} mastered</Badge>
        <span>Card {Math.min(idx + 1, vocabs.length)} / {vocabs.length}</span>
      </div>

      {loading ? (
        <Card><CardContent className="flex h-64 items-center justify-center text-muted-foreground">Loading flashcards…</CardContent></Card>
      ) : vocabs.length === 0 ? (
        <Card><CardContent className="flex h-64 items-center justify-center text-muted-foreground">No vocabulary found.</CardContent></Card>
      ) : current ? (
        <>
          <div className="flip-card h-72 w-full cursor-pointer sm:h-80" onClick={() => setFlipped((f) => !f)} style={{ perspective: '1200px' }}>
            <div className={`flip-card-inner relative h-full w-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              {/* FRONT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm" style={{ backfaceVisibility: 'hidden' }}>
                <Badge variant="outline" className="mb-3">{current.category}</Badge>
                <div className="text-3xl font-bold sm:text-4xl">{current.word}</div>
                {current.phonetic && <div className="mt-2 text-sm text-muted-foreground">{current.phonetic}</div>}
                <div className="mt-1 text-xs italic text-primary">{current.partOfSpeech}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.word) }}
                  className="mt-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-primary"
                  aria-label="Pronounce"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <p className="mt-4 text-xs text-muted-foreground">Click card to flip</p>
              </div>
              {/* BACK */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-secondary/40 p-6 text-center shadow-sm" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="text-sm font-medium text-primary">{current.definition}</div>
                <div className="mt-3 max-h-24 overflow-y-auto scrollbar-thin text-sm italic text-muted-foreground">"{current.example}"</div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.example) }}
                  className="mt-3 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-primary"
                  aria-label="Pronounce example"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Previous"><ChevronLeft className="h-5 w-5" /></Button>
            <div className="flex flex-1 gap-2">
              <Button variant="outline" className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => grade(false)}>
                <X className="mr-1.5 h-4 w-4" /> Don&apos;t know
              </Button>
              <Button variant="outline" className="flex-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => grade(true)}>
                <Check className="mr-1.5 h-4 w-4" /> I know it
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next"><ChevronRight className="h-5 w-5" /></Button>
          </div>

          <Button variant="ghost" size="sm" className="mx-auto block" onClick={() => { setIdx(0); setFlipped(false); fetchVocab() }}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restart deck
          </Button>
        </>
      ) : null}
    </div>
  )
}
