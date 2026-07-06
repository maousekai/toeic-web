'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, type View } from '@/lib/router'

/**
 * BackButton — Nút quay lại trang trước.
 * @param targetView - View để quay về (mặc định: home)
 * @param label - Text hiển thị (mặc định: "Trang chủ")
 */
export function BackButton({ targetView = { name: 'home' }, label = 'Trang chủ' }: {
  targetView?: View
  label?: string
}) {
  const { navigate } = useRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(targetView)}
      className="gap-1.5 mb-4 text-muted-foreground hover:text-foreground"
      suppressHydrationWarning
    >
      <ArrowLeft className="h-4 w-4" /> <span suppressHydrationWarning>{label}</span>
    </Button>
  )
}
