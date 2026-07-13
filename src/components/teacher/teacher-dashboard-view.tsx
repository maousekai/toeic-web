'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  GraduationCap, Users, MessageSquare, Video, Star, DollarSign, Clock,
  Edit, Wifi, Video as VideoIcon, ArrowRight, Crown, TrendingUp, Calendar,
} from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useToast } from '@/hooks/use-toast'
import { BackButton } from '@/components/site/back-button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function TeacherDashboardView() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [earnings, setEarnings] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'earnings' | 'classes'>('overview')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [dashRes, studentsRes, earningsRes] = await Promise.all([
        fetch('/api/teacher/dashboard'),
        fetch('/api/teacher/students'),
        fetch('/api/teacher/earnings'),
      ])
      const dash = await dashRes.json().catch(() => ({}))
      const studs = await studentsRes.json().catch(() => ({}))
      const earn = await earningsRes.json().catch(() => ({}))
      setData(dash)
      setStudents(studs.students || [])
      setEarnings(earn)
    } catch (e) {
      console.error('fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!data || !data.teacher) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Không tìm thấy profile giáo viên</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản của bạn chưa được kích hoạt là giáo viên. Liên hệ admin để được cấp quyền.
        </p>
      </div>
    )
  }

  const { teacher, stats, recentChats, upcomingClasses } = data

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label="Trang chủ" />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-xl font-bold text-primary-foreground">
              {teacher.name?.charAt(0).toUpperCase()}
            </div>
            {teacher.isOnline && (
              <span className="absolute bottom-0 right-0 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {teacher.rating.toFixed(1)}
              </Badge>
              <Badge variant="outline">{teacher.totalLessons} bài đã dạy</Badge>
              {teacher.isOnline ? (
                <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Offline</Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-1.5" onClick={() => setEditOpen(true)}>
          <Edit className="h-4 w-4" /> Sửa profile
        </Button>
      </div>

      {/* Bio + subjects */}
      {teacher.bio && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{teacher.bio}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {teacher.subjects.split(',').map((s: string) => (
                <Badge key={s} variant="secondary" className="text-[10px]">{s.trim()}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center">
          <Users className="mx-auto h-6 w-6 text-primary" />
          <div className="mt-1 text-2xl font-bold">{stats.activeStudents}</div>
          <div className="text-xs text-muted-foreground">Học sinh</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <MessageSquare className="mx-auto h-6 w-6 text-teal-600" />
          <div className="mt-1 text-2xl font-bold">{stats.totalChats}</div>
          <div className="text-xs text-muted-foreground">Phòng chat</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <Video className="mx-auto h-6 w-6 text-violet-600" />
          <div className="mt-1 text-2xl font-bold">{stats.totalClasses}</div>
          <div className="text-xs text-muted-foreground">Lớp học</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <DollarSign className="mx-auto h-6 w-6 text-emerald-600" />
          <div className="mt-1 text-2xl font-bold">{(earnings?.estimatedEarnings || 0).toLocaleString('vi-VN')}₫</div>
          <div className="text-xs text-muted-foreground">Doanh thu ước tính</div>
        </CardContent></Card>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-2 border-b">
        {[
          { id: 'overview', label: 'Tổng quan' },
          { id: 'students', label: `Học sinh (${students.length})` },
          { id: 'classes', label: `Lớp học (${upcomingClasses.length})` },
          { id: 'earnings', label: 'Doanh thu' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent chats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-teal-600" /> Chat gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentChats.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có chat nào.</p>
              ) : recentChats.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => navigate({ name: 'chat', roomId: c.id })}
                  className="flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                    {c.student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.student.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {c.lastMessage || 'Chưa có tin nhắn'}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Video className="h-4 w-4 text-violet-600" /> Lớp học đang chờ/đang diễn ra
              </CardTitle>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={async () => {
                const res = await fetch('/api/class/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ studentUserId: user.id }) // Quick room self assign
                })
                const d = await res.json().catch(() => ({}))
                if (d.session) navigate({ name: 'class', roomCode: d.session.roomCode })
              }}>
                + Tạo phòng nhanh
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có lớp nào.</p>
              ) : upcomingClasses.map((c: any) => (
                <div key={c.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{c.student.name}</div>
                      <div className="text-xs text-muted-foreground">Mã phòng: <span className="font-mono font-bold">{c.roomCode}</span></div>
                    </div>
                    <Badge variant={c.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {c.status === 'ACTIVE' ? 'Đang diễn ra' : 'Đang chờ'}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full gap-1.5"
                    onClick={() => navigate({ name: 'class', roomCode: c.roomCode })}
                  >
                    <VideoIcon className="h-3.5 w-3.5" /> Vào lớp
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students tab */}
      {activeTab === 'students' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" /> Danh sách học sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có học sinh nào.</p>
            ) : (
              <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Tin nhắn</TableHead>
                    <TableHead>Tương tác cuối</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                        </TableCell>
                        <TableCell>{s.messageCount}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(s.lastInteraction).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          {s.locked ? (
                            <Badge variant="destructive">Đã khoá</Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">Hoạt động</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={async () => {
                              // Teacher tạo/mở chat với học sinh này
                              const res = await fetch('/api/chat/rooms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ studentUserId: s.id }),
                              })
                              const d = await res.json().catch(() => ({}))
                              if (res.ok && d.room) {
                                navigate({ name: 'chat', roomId: d.room.id })
                              } else {
                                toast({ title: 'Lỗi', description: d.error || 'Không tạo được phòng chat', variant: 'destructive' })
                              }
                            }}
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Chat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Classes tab */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          {/* Create class for student */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <VideoIcon className="h-4 w-4 text-violet-600" /> Mở lớp mới cho học sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có học sinh nào để mở lớp.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {students.slice(0, 8).map((s) => (
                    <Button
                      key={s.id}
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={async () => {
                        const res = await fetch('/api/class/create', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ studentUserId: s.id }),
                        })
                        const d = await res.json().catch(() => ({}))
                        if (d.session) {
                          toast({ title: '✅ Đã tạo lớp', description: `Mã phòng: ${d.session.roomCode}` })
                          navigate({ name: 'class', roomCode: d.session.roomCode })
                        } else {
                          toast({ title: 'Lỗi', description: d.error || 'Không tạo được', variant: 'destructive' })
                        }
                      }}
                    >
                      <VideoIcon className="h-3.5 w-3.5" /> {s.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming/active classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Video className="h-4 w-4 text-violet-600" /> Lớp học đang chờ/đang diễn ra
              </CardTitle>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={async () => {
                const res = await fetch('/api/class/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ studentUserId: user.id })
                })
                const d = await res.json().catch(() => ({}))
                if (d.session) navigate({ name: 'class', roomCode: d.session.roomCode })
              }}>
                + Tạo phòng nhanh
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Chưa có lớp học nào.</p>
                  <p className="text-xs text-muted-foreground">Mở lớp mới ở trên hoặc chờ học sinh tạo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingClasses.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{c.student.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Mã phòng: <span className="font-mono font-bold">{c.roomCode}</span> ·{' '}
                        Tạo: {new Date(c.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={c.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {c.status === 'ACTIVE' ? '🟢 Đang diễn ra' : '⏳ Đang chờ'}
                      </Badge>
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate({ name: 'class', roomCode: c.roomCode })}
                      >
                        <VideoIcon className="h-3.5 w-3.5" /> Vào lớp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Earnings tab */}
      {activeTab === 'earnings' && earnings && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Doanh thu ước tính
              </div>
              <div className="mt-1 text-2xl font-bold text-emerald-600">
                {earnings.estimatedEarnings.toLocaleString('vi-VN')}₫
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4 text-violet-600" /> Lớp đã dạy
              </div>
              <div className="mt-1 text-2xl font-bold">{earnings.totalClasses}</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" /> Giá/giờ
              </div>
              <div className="mt-1 text-2xl font-bold">{earnings.hourlyRate.toLocaleString('vi-VN')}₫</div>
            </CardContent></Card>
          </div>

          {/* Monthly stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" /> Thống kê theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {earnings.monthlyStats.map((m: any) => (
                  <div key={m.month} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="font-medium">{m.month}</div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{m.classes} lớp</span>
                      <span className="font-bold text-emerald-600">{m.earnings.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent completed classes */}
          {earnings.recentClasses && earnings.recentClasses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" /> Lớp đã hoàn thành
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Thời lượng</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {earnings.recentClasses.map((c: any) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.student.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {c.endedAt ? new Date(c.endedAt).toLocaleString('vi-VN') : '-'}
                          </TableCell>
                          <TableCell>{c.duration ? `${c.duration} phút` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {editOpen && (
        <EditProfileModal
          teacher={teacher}
          onClose={() => setEditOpen(false)}
          onSaved={() => { setEditOpen(false); fetchData() }}
        />
      )}
    </div>
  )
}

function EditProfileModal({ teacher, onClose, onSaved }: { teacher: any; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    bio: teacher.bio || '',
    subjects: teacher.subjects || '',
    hourlyRate: teacher.hourlyRate || 100000,
    isOnline: teacher.isOnline,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/teacher/dashboard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: '✅ Đã cập nhật profile' })
        onSaved()
      } else {
        toast({ title: 'Lỗi', variant: 'destructive' })
      }
    } finally { setSaving(false) }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Sửa profile giáo viên</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-4">
          <div><Label className="text-xs">Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
          <div><Label className="text-xs">Môn học (phẩy phân cách)</Label><Input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></div>
          <div><Label className="text-xs">Giá/giờ (VND)</Label><Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: parseInt(e.target.value) || 0 })} /></div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isOnline} onChange={(e) => setForm({ ...form, isOnline: e.target.checked })} />
            <Wifi className="h-4 w-4" /> Trực tuyến (online)
          </label>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
