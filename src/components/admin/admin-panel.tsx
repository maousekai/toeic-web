'use client'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Users, Brain, BookOpen, FileText, TrendingUp, Database, Plus, Pencil, Trash2, LayoutDashboard, Lock, LockOpen, GraduationCap, Crown, Wallet, DollarSign, MessageSquare, Video, Star, Eye, Gift, RefreshCw } from 'lucide-react'
import { AdminShell } from './admin-shell'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Quản lý Học viên',
  teachers: 'Quản lý Giáo viên',
  vip: 'Quản lý Gói VIP',
  payments: 'Quản lý Giao dịch',
  vocab: 'Quản lý Từ vựng',
  grammar: 'Quản lý Ngữ pháp',
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="h-7 w-7 text-primary" />
          {TAB_TITLES[activeTab] || 'Dashboard'}
        </h1>
      </div>
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'teachers' && <TeachersTab />}
      {activeTab === 'vip' && <VipPackagesTab />}
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'vocab' && <VocabTab />}
      {activeTab === 'grammar' && <GrammarTab />}
    </AdminShell>
  )
}

function DashboardTab() {
  const [stats, setStats] = useState<any>(null)
  const [vocabByLevel, setVocabByLevel] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d.stats); setVocabByLevel(d.vocabByLevel || []) }).finally(() => setLoading(false)) }, [])
  if (loading) return <Skeleton className="h-64 w-full" />
  if (!stats) return <p className="text-muted-foreground">Lỗi tải dữ liệu.</p>
  const cards = [
    { label: 'Người dùng', value: stats.users, icon: Users, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Giáo viên', value: stats.teachers || 0, icon: GraduationCap, color: 'bg-teal-500/10 text-teal-600' },
    { label: 'VIP active', value: stats.activeVipSubs || 0, icon: Crown, color: 'bg-amber-500/10 text-amber-600' },
    { label: 'Tổng nạp tiền', value: `${((stats.totalTopup || 0) / 1000).toFixed(0)}k₫`, icon: Wallet, color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Doanh thu VIP', value: `${((stats.totalVipRevenue || 0) / 1000).toFixed(0)}k₫`, icon: TrendingUp, color: 'bg-rose-500/10 text-rose-600' },
    { label: 'Từ vựng', value: stats.vocabs, icon: Brain, color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Bài ngữ pháp', value: stats.grammarLessons, icon: BookOpen, color: 'bg-teal-500/10 text-teal-600' },
    { label: 'Câu hỏi', value: stats.questions, icon: FileText, color: 'bg-amber-500/10 text-amber-600' },
    { label: 'Bộ đề', value: stats.testSets, icon: Database, color: 'bg-violet-500/10 text-violet-600' },
    { label: 'Lượt thi', value: stats.attempts, icon: TrendingUp, color: 'bg-rose-500/10 text-rose-600' },
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <Card key={c.label}><CardContent className="flex items-center gap-4 p-5">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', c.color)}><c.icon className="h-6 w-6" /></div>
            <div><div className="text-2xl font-bold tabular-nums">{c.value}</div><div className="text-xs text-muted-foreground" suppressHydrationWarning>{c.label}</div></div>
          </CardContent></Card>
        ))}
      </div>
      {vocabByLevel.length > 0 && (
        <Card><CardHeader><CardTitle className="text-base" suppressHydrationWarning>Từ vựng theo cấp độ</CardTitle></CardHeader>
          <CardContent><div className="flex flex-wrap gap-2">{vocabByLevel.map(v => <Badge key={v.level} variant="secondary" className="text-sm" suppressHydrationWarning>{v.level}: {v._count} từ</Badge>)}</div></CardContent>
        </Card>
      )}
    </div>
  )
}

function VocabTab() {
  const { toast } = useToast()
  const [vocabs, setVocabs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const fetchVocabs = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/vocab?q=${search}&level=${levelFilter}`)
    const data = await res.json()
    setVocabs(data.vocabs || [])
    setLoading(false)
  }, [search, levelFilter])
  useEffect(() => { fetchVocabs() }, [fetchVocabs])
  const handleDelete = async (id: string) => { if (!confirm('Xóa?')) return; await fetch(`/api/admin/vocab?id=${id}`, { method: 'DELETE' }); toast({ title: 'Đã xóa' }); fetchVocabs() }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Tìm từ..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger><SelectContent>{['all','A0','A1','A2','B1','B2','C1','C2'].map(l => <SelectItem key={l} value={l}>{l === 'all' ? 'Tất cả' : l}</SelectItem>)}</SelectContent></Select>
        <Button onClick={() => { setEditing(null); setShowForm(true) }} className="gap-1.5"><Plus className="h-4 w-4" /> Thêm từ</Button>
      </div>
      {loading ? <Skeleton className="h-64 w-full" /> : (
        <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
          <Table><TableHeader><TableRow><TableHead>Level</TableHead><TableHead>Từ</TableHead><TableHead>Loại</TableHead><TableHead>Nghĩa</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
            <TableBody>{vocabs.map(v => (
              <TableRow key={v.id}>
                <TableCell><Badge variant="outline">{v.level}</Badge></TableCell>
                <TableCell className="font-medium">{v.word}</TableCell>
                <TableCell className="text-muted-foreground">{v.partOfSpeech}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{v.definition}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(v); setShowForm(true) }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      )}
      {showForm && <VocabForm vocab={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchVocabs() }} />}
    </div>
  )
}

function VocabForm({ vocab, onClose, onSaved }: any) {
  const { toast } = useToast()
  const [form, setForm] = useState({ word: vocab?.word || '', phonetic: vocab?.phonetic || '', partOfSpeech: vocab?.partOfSpeech || '', definition: vocab?.definition || '', example: vocab?.example || '', translation: vocab?.translation || '', category: vocab?.category || 'general', level: vocab?.level || 'A1' })
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    try {
      if (vocab) await fetch('/api/admin/vocab', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: vocab.id, ...form }) })
      else await fetch('/api/admin/vocab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast({ title: vocab ? 'Đã cập nhật' : 'Đã thêm' }); onSaved()
    } catch { toast({ title: 'Lỗi', variant: 'destructive' }) } finally { setSaving(false) }
  }
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{vocab ? 'Sửa từ vựng' : 'Thêm từ vựng'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Từ *</Label><Input value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} /></div><div><Label className="text-xs">Loại *</Label><Input value={form.partOfSpeech} onChange={e => setForm({ ...form, partOfSpeech: e.target.value })} /></div></div>
          <div><Label className="text-xs">Phiên âm</Label><Input value={form.phonetic} onChange={e => setForm({ ...form, phonetic: e.target.value })} /></div>
          <div><Label className="text-xs">Nghĩa *</Label><Input value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} /></div>
          <div><Label className="text-xs">Ví dụ</Label><Textarea value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} rows={2} /></div>
          <div><Label className="text-xs">Dịch nghĩa</Label><Input value={form.translation} onChange={e => setForm({ ...form, translation: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Level</Label><Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['A0','A1','A2','B1','B2','C1','C2'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Category</Label><Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['general','business','office','finance','marketing','hr','travel','tech'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </div>
        <DialogFooter className="mt-4"><Button variant="outline" onClick={onClose}>Hủy</Button><Button onClick={save} disabled={saving || !form.word || !form.definition}>{saving ? 'Đang lưu...' : 'Lưu'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function GrammarTab() {
  const { toast } = useToast()
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const fetchLessons = useCallback(async () => { setLoading(true); const res = await fetch('/api/admin/grammar'); const data = await res.json(); setLessons(data.lessons || []); setLoading(false) }, [])
  useEffect(() => { fetchLessons() }, [fetchLessons])
  const handleDelete = async (id: string) => { if (!confirm('Xóa?')) return; await fetch(`/api/admin/grammar?id=${id}`, { method: 'DELETE' }); toast({ title: 'Đã xóa' }); fetchLessons() }
  return (
    <div className="space-y-4">
      <Button onClick={() => { setEditing(null); setShowForm(true) }} className="gap-1.5"><Plus className="h-4 w-4" /> Thêm bài</Button>
      {loading ? <Skeleton className="h-64 w-full" /> : (
        <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
          <Table><TableHeader><TableRow><TableHead>Level</TableHead><TableHead>Tiêu đề</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
            <TableBody>{lessons.map(l => (
              <TableRow key={l.id}><TableCell><Badge variant="outline">{l.level}</Badge></TableCell><TableCell className="font-medium">{l.title}</TableCell><TableCell className="text-muted-foreground">{l.category}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => { setEditing(l); setShowForm(true) }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      )}
      {showForm && <GrammarForm lesson={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchLessons() }} />}
    </div>
  )
}

function GrammarForm({ lesson, onClose, onSaved }: any) {
  const { toast } = useToast()
  const [form, setForm] = useState({ title: lesson?.title || '', slug: lesson?.slug || '', category: lesson?.category || 'general', level: lesson?.level || 'intermediate', summary: lesson?.summary || '', content: lesson?.content || '', example: lesson?.example || '' })
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    try {
      if (lesson) await fetch('/api/admin/grammar', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: lesson.id, ...form }) })
      else await fetch('/api/admin/grammar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast({ title: lesson ? 'Đã cập nhật' : 'Đã thêm' }); onSaved()
    } catch { toast({ title: 'Lỗi', variant: 'destructive' }) } finally { setSaving(false) }
  }
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{lesson ? 'Sửa bài ngữ pháp' : 'Thêm bài ngữ pháp'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-4">
          <div><Label className="text-xs">Tiêu đề *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label className="text-xs">Slug *</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Level</Label><Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['beginner','intermediate','advanced'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Category</Label><Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['tenses','conditionals','voice','articles','prepositions','verb-forms','clauses','adjectives','modals','general'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label className="text-xs">Tóm tắt</Label><Input value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} /></div>
          <div><Label className="text-xs">Nội dung (Markdown) *</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} className="font-mono text-sm" /></div>
          <div><Label className="text-xs">Ví dụ</Label><Input value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} /></div>
        </div>
        <DialogFooter className="mt-4"><Button variant="outline" onClick={onClose}>Hủy</Button><Button onClick={save} disabled={saving || !form.title || !form.slug || !form.content}>{saving ? 'Đang lưu...' : 'Lưu'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function UsersTab() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [detailUser, setDetailUser] = useState<any | null>(null)
  const fetchUsers = useCallback(async () => { setLoading(true); const res = await fetch('/api/admin/users'); const data = await res.json().catch(() => ({})); setUsers(data.users || []); setLoading(false) }, [])
  useEffect(() => { fetchUsers() }, [fetchUsers])
  const handleRoleChange = async (id: string, role: string) => { await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role }) }); toast({ title: 'Đã đổi role' }); fetchUsers() }
  const handleDelete = async (id: string) => { if (!confirm('Xoá tài khoản này?')) return; await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' }); toast({ title: 'Đã xoá' }); fetchUsers() }
  const handleToggleLock = async (u: any) => {
    const nextLocked = !u.locked
    const verb = nextLocked ? 'khoá' : 'mở khoá'
    if (!confirm(`Bạn có chắc muốn ${verb} tài khoản "${u.email}"?`)) return
    setTogglingId(u.id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u.id, locked: nextLocked }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Không thể thay đổi trạng thái', description: data?.error || 'Lỗi không xác định', variant: 'destructive' })
        return
      }
      toast({
        title: nextLocked ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản',
        description: nextLocked
          ? `${u.email} sẽ không thể đăng nhập cho đến khi được mở khoá.`
          : `${u.email} có thể đăng nhập lại bình thường.`,
      })
      fetchUsers()
    } catch {
      toast({ title: 'Lỗi kết nối', variant: 'destructive' })
    } finally {
      setTogglingId(null)
    }
  }
  if (loading) return <Skeleton className="h-64 w-full" />

  const lockedCount = users.filter(u => u.locked).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5"><Users className="h-3.5 w-3.5" /> {users.length} học sinh</Badge>
        {lockedCount > 0 && (
          <Badge variant="destructive" className="gap-1.5"><Lock className="h-3.5 w-3.5" /> {lockedCount} đã khoá</Badge>
        )}
      </div>
      {users.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Chưa có học sinh nào đăng ký.
        </div>
      ) : (
        <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id} className={cn(u.locked && 'opacity-60')}>
                  <TableCell className="font-medium">
                    {u.name}
                    {u.locked && <span className="ml-2 text-xs text-rose-500">(đã khoá)</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={v => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                        <SelectItem value="INSTRUCTOR">INSTRUCTOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {u.locked ? (
                      <Badge variant="destructive" className="gap-1"><Lock className="h-3 w-3" /> Đã khoá</Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15"><LockOpen className="h-3 w-3" /> Hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(u.createdAt).toLocaleDateString('en-US')}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button variant="ghost" size="icon" title="Xem chi tiết" onClick={() => setDetailUser(u)}>
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={u.locked ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
                        disabled={togglingId === u.id}
                        onClick={() => handleToggleLock(u)}
                      >
                        {u.locked
                          ? <LockOpen className="h-4 w-4 text-emerald-600" />
                          : <Lock className="h-4 w-4 text-amber-600" />}
                      </Button>
                      <Button variant="ghost" size="icon" title="Xoá tài khoản" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {detailUser && <UserDetailModal userId={detailUser.id} onClose={() => setDetailUser(null)} />}
    </div>
  )
}

// ============ USER DETAIL MODAL ============
function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { toast } = useToast()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [giftAmount, setGiftAmount] = useState('100000')

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`)
    const d = await res.json().catch(() => ({}))
    setData(d)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchDetail() }, [fetchDetail])

  const handleGift = async () => {
    const amount = parseInt(giftAmount)
    if (!amount || amount <= 0) return
    if (!confirm(`Tặng ${amount.toLocaleString('vi-VN')}₫ cho user này?`)) return
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addBalance: amount }),
    })
    const d = await res.json().catch(() => ({}))
    if (res.ok) {
      toast({ title: '✅ Đã tặng tiền', description: `+${amount.toLocaleString('vi-VN')}₫` })
      fetchDetail()
    } else {
      toast({ title: 'Lỗi', description: d.error, variant: 'destructive' })
    }
  }

  const handleResetAi = async () => {
    if (!confirm('Reset số câu AI đã dùng về 0?')) return
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetAiCount: true }),
    })
    toast({ title: '✅ Đã reset AI counter' })
    fetchDetail()
  }

  const handleToggleLock = async () => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locked: !data.user.locked }),
    })
    toast({ title: data.user.locked ? 'Đã mở khoá' : 'Đã khoá' })
    fetchDetail()
  }

  if (loading) return <Dialog open onOpenChange={onClose}><DialogContent><Skeleton className="h-96 w-full" /></DialogContent></Dialog>
  if (!data || !data.user) return <Dialog open onOpenChange={onClose}><DialogContent><p>Không tìm thấy user</p></DialogContent></Dialog>

  const { user, wallet, activeVip, vipHistory, payments, chatRooms, classSessions, testAttempts, stats } = data

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-bold">{user.name}</div>
              <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{user.role}</Badge>
            {user.locked ? (
              <Badge variant="destructive" className="gap-1"><Lock className="h-3 w-3" /> Đã khoá</Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"><LockOpen className="h-3 w-3" /> Hoạt động</Badge>
            )}
            {activeVip ? (
              <Badge className="gap-1 bg-amber-500/15 text-amber-600"><Crown className="h-3 w-3" /> VIP: {activeVip.package.name}</Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card><CardContent className="p-3 text-center">
              <Wallet className="mx-auto h-5 w-5 text-emerald-600" />
              <div className="mt-1 text-lg font-bold">{(wallet?.balance || 0).toLocaleString('vi-VN')}₫</div>
              <div className="text-[10px] text-muted-foreground">Số dư ví</div>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <MessageSquare className="mx-auto h-5 w-5 text-teal-600" />
              <div className="mt-1 text-lg font-bold">{user.aiMessageCount}</div>
              <div className="text-[10px] text-muted-foreground">Câu AI đã hỏi</div>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <MessageSquare className="mx-auto h-5 w-5 text-violet-600" />
              <div className="mt-1 text-lg font-bold">{stats.chatRoomsCount}</div>
              <div className="text-[10px] text-muted-foreground">Phòng chat</div>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <Video className="mx-auto h-5 w-5 text-rose-600" />
              <div className="mt-1 text-lg font-bold">{stats.classSessionsCount}</div>
              <div className="text-[10px] text-muted-foreground">Lớp học</div>
            </CardContent></Card>
          </div>

          {/* Actions */}
          <Card><CardContent className="p-4 space-y-3">
            <div className="text-sm font-semibold">Quản lý tài khoản</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleToggleLock}>
                {user.locked ? <><LockOpen className="h-3.5 w-3.5" /> Mở khoá</> : <><Lock className="h-3.5 w-3.5" /> Khoá</>}
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleResetAi}>
                <RefreshCw className="h-3.5 w-3.5" /> Reset AI counter
              </Button>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="h-8 w-28"
                  placeholder="Số tiền"
                />
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGift}>
                  <Gift className="h-3.5 w-3.5" /> Tặng tiền
                </Button>
              </div>
            </div>
          </CardContent></Card>

          {/* Revenue summary */}
          <div className="grid grid-cols-2 gap-3">
            <Card><CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Tổng nạp tiền</div>
              <div className="text-lg font-bold text-emerald-600">{stats.totalPayments.toLocaleString('vi-VN')}₫</div>
            </CardContent></Card>
            <Card><CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Tổng chi VIP</div>
              <div className="text-lg font-bold text-amber-600">{stats.totalVipSpent.toLocaleString('vi-VN')}₫</div>
            </CardContent></Card>
          </div>

          {/* VIP history */}
          {vipHistory && vipHistory.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" /> Lịch sử VIP</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {vipHistory.slice(0, 5).map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between text-xs border-b pb-1">
                    <span className="font-medium">{v.package?.name}</span>
                    <span className="text-muted-foreground">
                      {new Date(v.startedAt).toLocaleDateString('vi-VN')} → {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent transactions */}
          {payments && payments.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-500" /> Giao dịch gần đây</CardTitle></CardHeader>
              <CardContent className="space-y-1 max-h-40 overflow-y-auto">
                {payments.slice(0, 8).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs border-b pb-1">
                    <span className={cn('font-medium', p.type === 'TOPUP' ? 'text-emerald-600' : 'text-amber-600')}>
                      {p.type === 'TOPUP' ? '+' : '-'}{p.amount.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-muted-foreground truncate ml-2">{p.description}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Test attempts */}
          {testAttempts && testAttempts.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Lượt thi ({stats.testAttemptsCount})</CardTitle></CardHeader>
              <CardContent className="space-y-1 max-h-32 overflow-y-auto">
                {testAttempts.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between text-xs border-b pb-1">
                    <span className="truncate">{t.testSetTitle || 'Test'}</span>
                    <span className="font-bold text-primary ml-2">{t.score || '-'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ TEACHERS TAB ============
function TeachersTab() {
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/teachers')
    const d = await res.json().catch(() => ({}))
    setTeachers(d.teachers || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTeachers() }, [fetchTeachers])

  const handleToggleOnline = async (t: any) => {
    await fetch(`/api/admin/teachers/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOnline: !t.isOnline }),
    })
    toast({ title: t.isOnline ? 'Đã đặt offline' : 'Đã đặt online' })
    fetchTeachers()
  }

  const handleDelete = async (t: any) => {
    if (!confirm(`Xoá giáo viên "${t.user.name}"? User sẽ bị demote về STUDENT.`)) return
    await fetch(`/api/admin/teachers/${t.id}`, { method: 'DELETE' })
    toast({ title: 'Đã xoá giáo viên' })
    fetchTeachers()
  }

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {teachers.length} giáo viên</Badge>
      </div>
      <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Giáo viên</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Giá/giờ</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Bài dạy</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {teachers.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="font-medium">{t.user.name}</div>
                  <div className="text-xs text-muted-foreground">{t.user.email}</div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{t.subjects}</TableCell>
                <TableCell className="font-medium">{t.hourlyRate.toLocaleString('vi-VN')}₫</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {t.rating.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>{t.totalLessons}</TableCell>
                <TableCell>
                  {t.isOnline ? (
                    <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Offline</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Sửa" onClick={() => setEditing(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title={t.isOnline ? 'Đặt offline' : 'Đặt online'} onClick={() => handleToggleOnline(t)}>
                      {t.isOnline ? <LockOpen className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-amber-600" />}
                    </Button>
                    <Button variant="ghost" size="icon" title="Xoá" onClick={() => handleDelete(t)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editing && <TeacherEditModal teacher={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchTeachers() }} />}
    </div>
  )
}

function TeacherEditModal({ teacher, onClose, onSaved }: { teacher: any; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    bio: teacher.bio || '',
    subjects: teacher.subjects || '',
    hourlyRate: teacher.hourlyRate || 100000,
    rating: teacher.rating || 5.0,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: '✅ Đã cập nhật' })
        onSaved()
      } else {
        toast({ title: 'Lỗi', variant: 'destructive' })
      }
    } finally { setSaving(false) }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Sửa thông tin giáo viên</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-4">
          <div><Label className="text-xs">Giáo viên</Label><Input value={teacher.user.name} disabled /></div>
          <div><Label className="text-xs">Môn học (phẩy phân cách)</Label><Input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></div>
          <div><Label className="text-xs">Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Giá/giờ (VND)</Label><Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: parseInt(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Đánh giá (0-5)</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} /></div>
          </div>
        </div>
        <DialogFooter className="mt-4"><Button variant="outline" onClick={onClose}>Hủy</Button><Button onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ VIP PACKAGES TAB ============
function VipPackagesTab() {
  const { toast } = useToast()
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchPkgs = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/vip-packages')
    const d = await res.json().catch(() => ({}))
    setPackages(d.packages || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPkgs() }, [fetchPkgs])

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá gói VIP này?')) return
    await fetch(`/api/admin/vip-packages/${id}`, { method: 'DELETE' })
    toast({ title: 'Đã xoá' })
    fetchPkgs()
  }

  if (loading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1.5"><Crown className="h-3.5 w-3.5 text-amber-500" /> {packages.length} gói VIP</Badge>
        <Button size="sm" className="gap-1.5" onClick={() => { setEditing(null); setShowForm(true) }}><Plus className="h-4 w-4" /> Thêm gói</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((p) => {
          const features = JSON.parse(p.features || '[]')
          return (
            <Card key={p.id} className={cn('relative', p.popular && 'ring-2 ring-primary')}>
              {p.popular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Phổ biến</Badge>}
              <CardHeader>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">{p.price.toLocaleString('vi-VN')}₫</div>
                <div className="text-xs text-muted-foreground">{p.durationDays} ngày</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="text-xs space-y-1">
                  {features.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="truncate">• {f}</li>
                  ))}
                </ul>
                <div className="flex gap-1 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => { setEditing(p); setShowForm(true) }}><Pencil className="h-3 w-3" /> Sửa</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {showForm && <VipPackageForm pkg={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchPkgs() }} />}
    </div>
  )
}

function VipPackageForm({ pkg, onClose, onSaved }: { pkg: any | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: pkg?.name || '',
    price: pkg?.price || 199000,
    durationDays: pkg?.durationDays || 30,
    features: pkg?.features || '["Chat với giáo viên","Video call 1-1"]',
    color: pkg?.color || 'emerald',
    popular: pkg?.popular || false,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      if (pkg) {
        await fetch(`/api/admin/vip-packages/${pkg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/admin/vip-packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      toast({ title: pkg ? '✅ Đã cập nhật' : '✅ Đã tạo' })
      onSaved()
    } finally { setSaving(false) }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{pkg ? 'Sửa gói VIP' : 'Thêm gói VIP'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-4">
          <div><Label className="text-xs">Tên gói *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Giá (VND)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} /></div>
            <div><Label className="text-xs">Số ngày</Label><Input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <div><Label className="text-xs">Features (JSON array)</Label><Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} className="font-mono text-xs" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Màu</Label>
              <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['emerald', 'teal', 'amber', 'rose', 'violet', 'sky'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
                Phổ biến
              </label>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4"><Button variant="outline" onClick={onClose}>Hủy</Button><Button onClick={save} disabled={saving || !form.name}>{saving ? 'Đang lưu...' : 'Lưu'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ PAYMENTS TAB ============
function PaymentsTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const url = filter ? `/api/admin/payments?type=${filter}` : '/api/admin/payments'
    const res = await fetch(url)
    const d = await res.json().catch(() => ({}))
    setData(d)
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <Skeleton className="h-64 w-full" />
  if (!data) return <p className="text-muted-foreground">Lỗi tải dữ liệu.</p>

  const { transactions, summary } = data

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="h-4 w-4 text-emerald-600" /> Tổng nạp tiền</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{summary.totalTopup.toLocaleString('vi-VN')}₫</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Crown className="h-4 w-4 text-amber-500" /> Doanh thu VIP</div>
          <div className="mt-1 text-2xl font-bold text-amber-600">{summary.totalVipRevenue.toLocaleString('vi-VN')}₫</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-primary" /> Tổng giao dịch</div>
          <div className="mt-1 text-2xl font-bold">{summary.totalTransactions}</div>
        </CardContent></Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button size="sm" variant={filter === '' ? 'default' : 'outline'} onClick={() => setFilter('')}>Tất cả</Button>
        <Button size="sm" variant={filter === 'TOPUP' ? 'default' : 'outline'} onClick={() => setFilter('TOPUP')}>Nạp tiền</Button>
        <Button size="sm" variant={filter === 'VIP_PURCHASE' ? 'default' : 'outline'} onClick={() => setFilter('VIP_PURCHASE')}>Mua VIP</Button>
      </div>

      {/* Transactions table */}
      <div className="rounded-lg border max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Mô tả</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Chưa có giao dịch</TableCell></TableRow>
            ) : transactions.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{t.user?.name || '?'}</div>
                  <div className="text-xs text-muted-foreground">{t.user?.email}</div>
                </TableCell>
                <TableCell>
                  {t.type === 'TOPUP' ? (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">Nạp tiền</Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600">VIP</Badge>
                  )}
                </TableCell>
                <TableCell className={cn('font-bold', t.type === 'TOPUP' ? 'text-emerald-600' : 'text-amber-600')}>
                  {t.type === 'TOPUP' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{t.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
