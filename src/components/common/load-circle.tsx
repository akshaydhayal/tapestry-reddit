import { useState, useEffect } from 'react'
import { LoaderCircle } from 'lucide-react'

export function LoadCircle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <LoaderCircle size={20} className="animate-spin" />
}
