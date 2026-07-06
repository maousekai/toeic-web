'use client'

import { useState } from 'react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useRouter, View } from '@/lib/router'
import { useToast } from '@/hooks/use-toast'
import { LogOut, User as UserIcon, LayoutDashboard, LogIn, UserPlus, ChevronDown, Shield } from 'lucide-react'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { openAuth } = useAuthUI()
  const { navigate } = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return <div className="h-9 w-9 rounded-full bg-secondary animate-pulse" />
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => openAuth('login')} className="hidden sm:inline-flex">
          <LogIn className="mr-1.5 h-4 w-4" /> Sign In
        </Button>
        <Button size="sm" onClick={() => openAuth('register')} className="gap-1.5">
          <UserPlus className="h-4 w-4" /> Get Started
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-accent" aria-label="User menu">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials(user.name) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{user.name.split(' ')[0]}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { navigate({ name: 'dashboard' }); setOpen(false) }}>
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { navigate({ name: 'tutor' }); setOpen(false) }}>
          <UserIcon className="mr-2 h-4 w-4" /> AI Tutor
        </DropdownMenuItem>
        {user.role === 'ADMIN' && (
          <DropdownMenuItem onClick={() => { navigate({ name: 'admin' }); setOpen(false) }}>
            <Shield className="mr-2 h-4 w-4" /> Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-rose-600 focus:text-rose-600"
          onClick={async () => {
            await logout()
            setOpen(false)
            toast({ title: 'Signed out', description: 'See you soon! 👋' })
            navigate({ name: 'home' })
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
