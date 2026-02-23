'use client'

import { Card } from '@/components/common/card'
import { CopyPaste } from '@/components/common/copy-paste'
import { FollowButton } from '@/components/profile/follow-button'
import { useGetProfileInfo } from '@/components/profile/hooks/use-get-profile-info'
import { User, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  username: string
}

export function Profile({ username }: Props) {
  const { data } = useGetProfileInfo({ username })
  const [fairScore, setFairScore] = useState<number | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Mock fetching FairScale API for this user
    setTimeout(() => {
      // Just a random-ish stable score between 100-900 for the demo based on their username length length
      setFairScore(Math.floor((username.length * 42) % 800) + 100)
    }, 800)
  }, [username])

  return (
    <Card className="bg-zinc-950/80 border-zinc-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex items-start space-x-5 h-full">
          {data?.profile?.image ? (
            <div className="relative">
              <Image
                src={data.profile.image}
                width={72}
                height={72}
                alt="avatar"
                className="object-cover rounded-full ring-4 ring-zinc-900 shadow-lg"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-zinc-900">
              {mounted && <User className="h-8 w-8 text-white" />}
            </div>
          )}
          
          <div className="flex flex-col">
            <Link href={`/${username}`} className="w-full hover:text-purple-400 transition-colors">
              <h2 className="text-2xl font-black text-white">{username}</h2>
            </Link>

            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-zinc-500 font-mono">
                {data?.walletAddress?.slice(0, 4)}...{data?.walletAddress?.slice(-4)}
              </p>
              {data?.walletAddress && <CopyPaste content={data?.walletAddress} />}
            </div>
            
            <div className="flex gap-4 mt-3 text-sm text-zinc-300">
              <span className="bg-zinc-900 px-3 py-1 rounded-full"><strong className="text-white">{data?.socialCounts.followers || 0}</strong> followers</span>
              <span className="bg-zinc-900 px-3 py-1 rounded-full"><strong className="text-white">{data?.socialCounts.following || 0}</strong> following</span>
            </div>
            
            {data?.profile?.bio && (
              <div className="mt-4 text-zinc-400 max-w-lg leading-relaxed">
                {data.profile.bio}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-end shadow-md w-full md:w-auto text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">FairScore</span>
              {mounted && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
            </div>
            {fairScore === null ? (
              <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded"></div>
            ) : (
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {fairScore}
              </div>
            )}
          </div>
          <FollowButton username={username} />
        </div>
      </div>
    </Card>
  )
}
