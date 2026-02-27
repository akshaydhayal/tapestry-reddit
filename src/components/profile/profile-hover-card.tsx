'use client'

import * as HoverCard from '@radix-ui/react-hover-card'
import { ReactNode } from 'react'
import Image from 'next/image'
import { User, Activity } from 'lucide-react'
import { useGetProfileInfo } from '@/components/profile/hooks/use-get-profile-info'
import { useFairScore } from '@/hooks/use-fairscore'
import { FollowButton } from '@/components/profile/follow-button'
import { useRouter } from 'next/navigation'
import { extractFairScore } from '@/utils/fairscore-cache'

interface Props {
  username: string
  children: ReactNode
}

export function ProfileHoverCard({ username, children }: Props) {
  const router = useRouter()
  // Fetch only when the card opens (handled by SWR internally but let's just use the hook)
  const { data } = useGetProfileInfo({ username })
  
  const { fairScore, isLoading: isScoreLoading } = useFairScore(
    data?.walletAddress,
    data?.profile?.username,
    data?.profile?.bio
  )

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/${username}`)
  }

  return (
    <HoverCard.Root openDelay={300} closeDelay={200}>
      <HoverCard.Trigger asChild>
        {children}
      </HoverCard.Trigger>
      
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 w-72 rounded-2xl bg-[#16181c] border border-zinc-800 shadow-xl p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={5}
        >
          {/* Header row: Avatar + Follow Button */}
          <div className="flex justify-between items-start">
            <div 
              className="h-16 w-16 rounded-full border-2 border-black bg-black overflow-hidden ring-0 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleProfileClick}
            >
              {data?.profile?.image ? (
                <Image
                  src={data.profile.image}
                  width={64}
                  height={64}
                  alt={username}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-white">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="pt-1">
              <FollowButton username={username} />
            </div>
          </div>

          {/* User Info */}
          <div className="mt-2">
            <h4 
              className="text-lg font-bold text-white leading-tight cursor-pointer hover:underline truncate"
              onClick={handleProfileClick}
            >
              {data?.profile?.username || username}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[15px] text-zinc-500">
                @{data?.walletAddress ? `${data.walletAddress.slice(0, 5)}...${data.walletAddress.slice(-4)}` : 'Loading...'}
              </span>
              
              {fairScore !== null && (
                <div className="flex gap-1 items-center px-1.5 py-0.5 bg-[#1d9aef]/10 text-[#1d9aef] rounded-md text-[11px] font-bold border border-[#1d9aef]/20">
                  <Activity size={10} className={isScoreLoading ? 'animate-pulse' : ''} />
                  <span>{isScoreLoading ? '...' : fairScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {data?.profile?.bio && (
            <p className="mt-3 text-[15px] text-zinc-100 leading-snug line-clamp-3">
              {extractFairScore(data.profile.bio).cleanBio}
            </p>
          )}

          {/* Stats */}
          <div className="mt-3 flex gap-4 text-[14px]">
            <div className="flex gap-1 text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <span className="font-bold text-white">{data?.socialCounts?.following || 0}</span>
              Following
            </div>
            <div className="flex gap-1 text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <span className="font-bold text-white">{data?.socialCounts?.followers || 0}</span>
              Followers
            </div>
          </div>

        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
