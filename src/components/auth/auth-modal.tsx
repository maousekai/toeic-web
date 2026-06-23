'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import {
  GraduationCap, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = 'login',
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  defaultMode?: Mode
  onSuccess?: () => void
}) {
  const { login } = useAuth()
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setMode(defaultMode)
      setErrors({})
    }
  }, [open, defaultMode])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (mode === 'register' && name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
    if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address.'
    if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          toast({ title: 'Registration failed', description: data.error, variant: 'destructive' })
          setLoading(false)
          return
        }
        // Auto-login after register
        const r = await login(email, password)
        if (r?.error) {
          toast({ title: 'Account created', description: 'Please sign in with your new credentials.' })
          setMode('login')
          setLoading(false)
          return
        }
        toast({ title: `Welcome aboard, ${name}! 🎉`, description: 'Your account is ready.' })
        onSuccess?.()
        onOpenChange(false)
        reset()
      } else {
        const r = await login(email, password)
        if (r?.error) {
          toast({ title: 'Sign in failed', description: r.error, variant: 'destructive' })
          setLoading(false)
          return
        }
        toast({ title: 'Welcome back! 👋', description: 'You are now signed in.' })
        onSuccess?.()
        onOpenChange(false)
        reset()
      }
    } catch (err: any) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [mode, name, email, password, login, toast, onSuccess, onOpenChange])

  const reset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setErrors({})
    setShowPwd(false)
  }

  // Strength meter for password
  const pwdStrength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 6) s++
    if (password.length >= 10) s++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:rounded-2xl">
        {/* Header band */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-teal-600 p-6 text-primary-foreground">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 text-xs">
                {mode === 'login' ? 'Sign in to track your TOEIC progress.' : 'Start your TOEIC journey — it only takes a minute.'}
              </DialogDescription>
            </div>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setErrors({}) }} className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b border-border/60 bg-transparent p-0">
            <TabsTrigger
              value="login"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="m-0 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                id="email-login"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email}
              >
                <Input
                  id="email-login"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                  autoComplete="email"
                  autoFocus
                />
              </Field>

              <Field
                id="pwd-login"
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              >
                <Input
                  id="pwd-login"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10"
                  autoComplete="current-password"
                />
              </Field>

              <Button type="submit" className="h-11 w-full text-sm" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                New here?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-medium text-primary hover:underline">
                  Create an account
                </button>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="register" className="m-0 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field id="name-reg" label="Full name" icon={<UserIcon className="h-4 w-4" />} error={errors.name}>
                <Input
                  id="name-reg"
                  type="text"
                  placeholder="Nguyen Van A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 pl-10"
                  autoComplete="name"
                  autoFocus
                />
              </Field>

              <Field id="email-reg" label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
                <Input
                  id="email-reg"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                  autoComplete="email"
                />
              </Field>

              <Field id="pwd-reg" label="Password" icon={<Lock className="h-4 w-4" />} error={errors.password}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              >
                <Input
                  id="pwd-reg"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10"
                  autoComplete="new-password"
                />
              </Field>

              {/* Password strength meter */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-colors',
                          pwdStrength >= i
                            ? pwdStrength <= 1 ? 'bg-rose-500' : pwdStrength === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                            : 'bg-secondary'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {pwdStrength <= 1 && 'Weak password'}
                    {pwdStrength === 2 && 'Fair password'}
                    {pwdStrength === 3 && 'Good password'}
                    {pwdStrength >= 4 && 'Strong password'}
                  </p>
                </div>
              )}

              <Button type="submit" className="h-11 w-full text-sm" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</> : <>Create Account <Sparkles className="ml-2 h-4 w-4" /></>}
              </Button>

              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Free forever — no credit card</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Track scores across devices</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Personal AI-powered study plans</li>
              </ul>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-medium text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  id, label, icon, error, trailing, children,
}: {
  id: string
  label: string
  icon: React.ReactNode
  error?: string
  trailing?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
        {trailing}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  )
}
