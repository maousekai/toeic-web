'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  FileText, Headphones, Volume2, Pause, Play, Download, ExternalLink,
  BookOpen, CheckCircle2, AlertCircle, ListChecks,
} from 'lucide-react'
import type { EtsResource, EtsTest } from '@/data/ets-exams'

async function checkFile(key: string, path: string): Promise<[string, 'ok' | 'missing']> {
  try {
    const res = await fetch(path, { method: 'HEAD' })
    return [key, res.ok ? 'ok' : 'missing']
  } catch {
    return [key, 'missing']
  }
}

export function EtsExamModal({
  exam,
  open,
  onOpenChange,
}: {
  exam: EtsResource | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [selectedTestId, setSelectedTestId] = useState<string>('')
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [fileStatus, setFileStatus] = useState<Record<string, 'loading' | 'ok' | 'missing'>>({})

  // Reset khi đổi exam
  useEffect(() => {
    if (exam && exam.tests.length > 0) {
      setSelectedTestId(exam.tests[0].id)
    }
    setAudioPlaying(false)
    setAudioTime(0)
    setFileStatus({})
  }, [exam?.id])

  // Check file khi đổi test
  const selectedTest: EtsTest | undefined = exam?.tests.find((t) => t.id === selectedTestId)
  useEffect(() => {
    if (!selectedTest) return
    setFileStatus({})
    setAudioPlaying(false)
    setAudioTime(0)
    const checks: Promise<[string, 'ok' | 'missing']>[] = []
    const f = selectedTest.files
    if (f.listening) checks.push(checkFile('listening', f.listening))
    if (f.reading) checks.push(checkFile('reading', f.reading))
    if (f.audio) checks.push(checkFile('audio', f.audio))
    if (f.transcript) checks.push(checkFile('transcript', f.transcript))
    Promise.all(checks).then((results) => {
      const status: Record<string, 'ok' | 'missing'> = {}
      results.forEach(([key, s]) => (status[key] = s))
      setFileStatus(status)
    })
  }, [selectedTestId])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setAudioPlaying(!audioPlaying)
  }

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = t
      setAudioTime(t)
    }
  }

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  if (!exam) return null

  const hasAnyFile = fileStatus.listening === 'ok' || fileStatus.reading === 'ok' || fileStatus.audio === 'ok' || fileStatus.transcript === 'ok'
  const allMissing = !hasAnyFile && Object.keys(fileStatus).length > 0
  const files = selectedTest?.files || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-teal-600 p-6 text-primary-foreground">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl">{exam.title}</DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  ETS {exam.year} · {exam.tests.length} tests · {exam.durationMin} phút/test · {exam.difficulty === 'easy' ? 'Dễ' : exam.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto scrollbar-thin p-6">
          {/* Test selector */}
          {exam.tests.length > 1 && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
              <ListChecks className="h-5 w-5 shrink-0 text-amber-600" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Chọn Test ({exam.tests.length} tests có sẵn)
                </label>
                <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                  <SelectTrigger className="mt-1 h-9 bg-background">
                    <SelectValue placeholder="Chọn test..." />
                  </SelectTrigger>
                  <SelectContent>
                    {exam.tests.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Warning nếu chưa có file */}
          {allMissing && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400">
                    File {selectedTest?.label} chưa được upload vào web
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bộ đề này hiện chỉ có trên Google Drive. Bạn có 2 cách:
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    <li><strong>Mở Google Drive</strong> để tải file về máy rồi làm</li>
                    <li>
                      <strong>Admin upload file</strong> vào folder{' '}
                      <code className="rounded bg-secondary px-1">
                        public/ets-exams/{exam.year}/{selectedTest?.id}/
                      </code>
                    </li>
                  </ol>
                  {exam.driveUrl && (
                    <Button className="mt-3" size="sm" asChild>
                      <a href={exam.driveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-4 w-4" /> Mở Google Drive
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mb-4 text-sm text-muted-foreground">{exam.description}</p>

          {/* Audio Player */}
          {fileStatus.audio === 'ok' && (
            <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-500/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-300">
                  <Headphones className="h-4 w-4" /> Audio Listening {selectedTest?.label}
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Volume2 className="h-3 w-3" /> ETS {exam.year}
                </Badge>
              </div>
              <audio
                ref={audioRef}
                src={files.audio}
                onTimeUpdate={(e) => setAudioTime((e.target as HTMLAudioElement).currentTime)}
                onLoadedMetadata={(e) => setAudioDuration((e.target as HTMLAudioElement).duration)}
                onEnded={() => setAudioPlaying(false)}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={toggleAudio}
                  className="h-10 w-10 shrink-0 rounded-full bg-teal-600 hover:bg-teal-700"
                >
                  {audioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 0}
                    value={audioTime}
                    onChange={seekAudio}
                    className="w-full accent-teal-600"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
                    <span>{fmtTime(audioTime)}</span>
                    <span>{fmtTime(audioDuration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs PDF */}
          <Tabs defaultValue="listening">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="listening" disabled={fileStatus.listening !== 'ok'} className="gap-1.5 text-xs">
                <Headphones className="h-3.5 w-3.5" /> Listening
              </TabsTrigger>
              <TabsTrigger value="reading" disabled={fileStatus.reading !== 'ok'} className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" /> Reading
              </TabsTrigger>
              <TabsTrigger value="transcript" disabled={fileStatus.transcript !== 'ok'} className="gap-1.5 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" /> Đáp án
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listening" className="mt-4">
              <PdfViewer src={files.listening!} title={`Đề Listening ${selectedTest?.label} - ETS ${exam.year}`} />
            </TabsContent>
            <TabsContent value="reading" className="mt-4">
              <PdfViewer src={files.reading!} title={`Đề Reading ${selectedTest?.label} - ETS ${exam.year}`} />
            </TabsContent>
            <TabsContent value="transcript" className="mt-4">
              <PdfViewer src={files.transcript!} title={`Đáp án + Transcript ${selectedTest?.label} - ETS ${exam.year}`} />
            </TabsContent>
          </Tabs>

          {/* Download + Drive link */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground">
              Tải {selectedTest?.label}:
            </span>
            {fileStatus.listening === 'ok' && (
              <Button size="sm" variant="outline" asChild>
                <a href={files.listening} download><Download className="mr-1 h-3.5 w-3.5" /> Listening</a>
              </Button>
            )}
            {fileStatus.reading === 'ok' && (
              <Button size="sm" variant="outline" asChild>
                <a href={files.reading} download><Download className="mr-1 h-3.5 w-3.5" /> Reading</a>
              </Button>
            )}
            {fileStatus.transcript === 'ok' && (
              <Button size="sm" variant="outline" asChild>
                <a href={files.transcript} download><Download className="mr-1 h-3.5 w-3.5" /> Đáp án</a>
              </Button>
            )}
            {exam.driveUrl && (
              <Button size="sm" variant="ghost" asChild className="ml-auto">
                <a href={exam.driveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3.5 w-3.5" /> Google Drive
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" /> {title}
        </span>
        <Button size="sm" variant="ghost" asChild className="h-7 px-2 text-xs">
          <a href={src} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3 w-3" /> Mở tab mới
          </a>
        </Button>
      </div>
      <iframe
        src={`${src}#toolbar=1&navpanes=0`}
        title={title}
        className="h-[60vh] w-full"
        style={{ border: 'none' }}
      />
    </div>
  )
}
