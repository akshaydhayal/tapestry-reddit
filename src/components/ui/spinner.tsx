import { useState, useEffect } from 'react'
import { cn } from '@/utils/utils'
import { LoaderCircle } from 'lucide-react'

export function Spinner({
  size = 24,
  large = false,
  className,
}: {
  size?: number
  large?: boolean
  className?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <LoaderCircle
      size={large ? 32 : size}
      className={cn('animate-spin', className)}
    />
  )
}

export function FullPageSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn('min-h-screen flex items-center justify-center', className)}
    >
      <Spinner large />
    </div>
  )
}
