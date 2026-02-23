'use client'

import { Button } from '@/components/common/button'
import { abbreviateWalletAddress } from '@/components/common/tools'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  Check,
  Clipboard,
  Coins,
  Home,
  LogIn,
  LogOut,
  Menu,
  RefreshCw,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCurrentWallet } from '../auth/hooks/use-current-wallet'
import { useGetProfiles } from '../auth/hooks/use-get-profiles'
import { CreateProfileContainer } from '../create-profile/create-profile-container'
import { DialectNotificationComponent } from '../notifications/dialect-notifications-component'
import { useProfileStore } from '@/store/profile'

export function Header() {
  const { walletAddress } = useCurrentWallet()
  const { mainUsername, profileImage, setProfileData } = useProfileStore()
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(false)
  const [profileUsername, setProfileUsername] = useState<string | null>(null)
  const { profiles } = useGetProfiles({
    walletAddress: walletAddress || '',
  })
  const { connected, disconnect } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        (dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        return
      }
      setIsDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (profiles && profiles.length) {
      setProfileData(profiles[0].profile.username, profiles[0].profile.image || null)
    }

    if (isProfileCreated && profileUsername) {
      setProfileData(profileUsername, null)
      setIsProfileCreated(false)
      setProfileUsername(null)
    }
  }, [profiles, isProfileCreated, profileUsername, setProfileData])

  return (
    <header className="hidden sm:flex flex-col w-[88px] xl:w-[275px] h-screen sticky top-0 pb-4 pt-1 px-2 xl:px-4 border-r border-zinc-900 justify-start shrink-0">
      <div className="flex flex-col gap-2 xl:gap-1 items-center xl:items-start w-full">
        <Link 
          href="/" 
          className="w-14 h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded-full hover:bg-zinc-900 transition-colors mb-2 text-3xl font-bold font-serif"
          title="Tapestry"
        >
          X
        </Link>

        <nav className="flex flex-col gap-2 w-full items-center xl:items-start">
          <Link
            href="/"
            className="flex items-center gap-5 p-3 xl:pr-6 rounded-full hover:bg-zinc-900 transition-colors w-fit xl:w-auto"
          >
            {mounted && <Home className="h-7 w-7" strokeWidth={2.5} />}
            <span className="hidden xl:inline text-xl font-medium">Home</span>
          </Link>
          
          <Link
            href="/subnets"
            className="flex items-center gap-5 p-3 xl:pr-6 rounded-full hover:bg-zinc-900 transition-colors w-fit xl:w-auto"
          >
            {mounted && <RefreshCw className="h-7 w-7" strokeWidth={2.5} />}
            <span className="hidden xl:inline text-xl font-medium">Explore</span>
          </Link>

          {mounted && mainUsername && (
            <Link
              href={`/${mainUsername}`}
              className="flex items-center gap-5 p-3 xl:pr-6 rounded-full hover:bg-zinc-900 transition-colors w-fit xl:w-auto"
            >
              <User className="h-7 w-7" strokeWidth={2.5} />
              <span className="hidden xl:inline text-xl font-medium">Profile</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex flex-col items-center xl:items-start gap-4 mb-2 mt-12 relative w-full">
         <div className="hidden xl:block ml-2 w-full">
            <DialectNotificationComponent />
         </div>
          {mounted && connected && (
            mainUsername ? (
              <Button
                variant="ghost"
                onClick={() => router.push(`/${mainUsername}`)}
                className="w-full flex items-center xl:justify-start justify-center p-3 xl:px-4 rounded-full hover:bg-zinc-900 transition-colors h-auto gap-3"
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    width={40}
                    height={40}
                    alt="avatar"
                    className="object-cover rounded-full min-w-[40px] h-[40px]"
                    unoptimized
                  />
                ) : (
                  <div className="min-w-[40px] h-[40px] bg-indigo-500 rounded-full flex items-center justify-center text-white">
                     <User size={20} />
                  </div>
                )}
                <div className="hidden xl:flex flex-col items-start min-w-0 pr-2">
                   <span className="font-bold text-base truncate w-full text-white">{mainUsername}</span>
                   <span className="text-zinc-500 text-sm truncate w-full">@{walletAddress?.slice(0, 8)}</span>
                </div>
              </Button>
            ) : (
              <div className="flex w-full justify-center xl:justify-start xl:px-2">
                 <CreateProfileContainer
                   setIsProfileCreated={setIsProfileCreated}
                   setProfileUsername={setProfileUsername}
                 />
              </div>
            )
          )}
          {mounted && (
            <div className="flex w-[80%] xl:w-full justify-center xl:px-2 mt-2">
              <WalletMultiButton className="!bg-[#1d9aef] hover:!bg-[#1a8cd8] transition-colors xl:!w-full !rounded-full !h-12 flex justify-center text-sm font-bold truncate" />
            </div>
          )}
      </div>
    </header>
  )
}
