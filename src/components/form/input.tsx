import { cn } from '@/utils/utils'
import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

export function Input({
  name,
  className,
  ...props
}: Props) {
  return (
    <input
      name={name}
      className={cn("bg-transparent border-zinc-800 border-2 rounded-md p-2 w-full focus:border-[#1d9aef] focus:outline-none transition-colors", className)}
      {...props}
    />
  )
}

