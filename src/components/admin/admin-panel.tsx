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
import { Users, Brain, BookOpen, FileText, TrendingUp, Database, Plus, Pencil, Trash2, LayoutDashboard, Lock, LockOpen } from 'lucide-react'
import { AdminShell } from './admin-shell'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="h-7 w-7 text-primary" />
          {activeTab === 'dashboard' && 'Dashboard'}{activeTab === 'vocab' && 'Quản lý Từ vựng'}{activeTab === 'grammar' && 'Quản lý Ngữ pháp'}{activeTab === 'users' && 'Quản lý Người dùng'}
        </h1>
      </div>
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'vocab' && <VocabTab />}
      {activeTab === 'grammar' && <GrammarTab />}
      {activeTab === 'users' && <UsersTab />}
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
  const fetchUsers = useCallback(async () => { setLoading(true); const res = await fetch('/api/admin/users'); const data = await res.json(); setUsers(data.users || []); setLoading(false) }, [])
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
    </div>
  )
}
