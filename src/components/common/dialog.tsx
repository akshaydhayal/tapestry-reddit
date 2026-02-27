'use client'

import { X } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: ReactNode
}

export default function Dialog({ isOpen, setIsOpen, children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-xs top-0 left-0 p-4">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-2xl relative min-w-[350px] w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}


