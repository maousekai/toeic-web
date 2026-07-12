'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, Video, Crown, Wifi, Search } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'
import { BackButton } from '@/components/site/back-button'
import { Input } from '@/components/ui/input'

export function TeachersView() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Giáo viên không được xem trang danh sách giáo viên → redirect
  useEffect(() => {
    if (user?.role === 'TEACHER') {
      navigate({ name: 'teacher-dashboard' })
      return
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.role === 'TEACHER') return
    fetch('/api/teachers')
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setTeachers(d.teachers || []))
      .finally(() => setLoading(false))
  }, [user])

  const handleStartChat = async (teacherUserId: string, teacherName: string) => {
    if (!user) { openAuth('login'); return }
    const res = await fetch('/api/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherUserId }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      if (data.needVip) {
        toast({
          title: 'Cần gói VIP',
          description: 'Mua VIP để chat với giáo viên',
          variant: 'destructive',
        })
        setTimeout(() => navigate({ name: 'vip' }), 1500)
      } else {
        toast({ title: 'Lỗi', description: data.error, variant: 'destructive' })
      }
      return
    }
    navigate({ name: 'chat', roomId: data.room.id, teacherUserId })
  }

  const filtered = teachers.filter((t) =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subjects.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label="Trang chủ" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giáo viên TOEIC</h1>
          <p className="mt-2 text-muted-foreground">
            Chọn giáo viên phù hợp với mục tiêu của bạn. Chat + video call 1-1 (cần VIP).
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Crown className="h-3.5 w-3.5 text-amber-500" /> Cần VIP
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên hoặc môn học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teachers grid */}
      {loading ? (
        <p className="mt-6 text-muted-foreground">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Không tìm thấy giáo viên.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3">
                  {/* Avatar with online status */}
                  <div className="relative shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-lg font-bold text-primary-foreground">
                      {t.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                    </div>
                    {t.isOnline && (
                      <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{t.name}</CardTitle>
                    <div className="mt-0.5 flex items-center gap-2 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{t.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">· {t.totalLessons} bài</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {t.isOnline ? (
                        <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px]">
                          <Wifi className="h-2.5 w-2.5" /> Online
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">Offline</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3 text-sm leading-relaxed line-clamp-3">{t.bio}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {t.subjects.split(',').map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s.trim()}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-primary">{t.hourlyRate.toLocaleString('vi-VN')}₫</span>
                    <span className="text-muted-foreground">/giờ</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => handleStartChat(t.userId, t.name)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Chat
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      if (!user) { openAuth('login'); return }
                      // Student requests call with this teacher
                      fetch('/api/class/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ teacherUserId: t.userId }),
                      })
                        .then((r) => r.json().catch(() => ({})))
                        .then((d) => {
                          if (d.session) navigate({ name: 'class', roomCode: d.session.roomCode })
                          else if (d.needVip) {
                            toast({ title: 'Cần VIP', description: d.error, variant: 'destructive' })
                            setTimeout(() => navigate({ name: 'vip' }), 1500)
                          } else {
                            toast({ title: 'Lỗi', description: d.error || 'Không tạo được phòng', variant: 'destructive' })
                          }
                        })
                    }}
                  >
                    <Video className="h-3.5 w-3.5" /> Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
