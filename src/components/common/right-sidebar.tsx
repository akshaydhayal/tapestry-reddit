'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Search } from 'lucide-react'
import { WhoToFollow } from '@/components/feed/who-to-follow'

export function RightSidebar() {
  const [mounted, setMounted] = useState(false)
  const { connected } = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside className="hidden lg:block w-[350px] pl-8 pt-2 h-screen sticky top-0">
      
      {/* Search Bar */}
      <div className="sticky top-0 bg-black pt-1 pb-3 z-10 w-full mb-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#1d9aef] transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#202327] border border-transparent focus:bg-black focus:border-[#1d9aef] rounded-full py-3.5 pl-11 pr-4 text-[15px] text-white placeholder-zinc-500 focus:outline-none transition-all"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Combined Reputation & Who to Follow Card */}
      <div className="bg-[#16181c] border border-zinc-900 rounded-2xl pt-4 pb-2 mb-4 w-full overflow-hidden">
        <div className="px-4 mb-4">
          <h3 className="font-extrabold text-xl text-white mb-2">Your Reputation</h3>
          {mounted && connected ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">842</span>
                <span className="text-zinc-500 mb-1 font-medium">FairScore</span>
              </div>
              <p className="text-[13px] leading-tight text-zinc-400">Top 5% active Solana wallets. Access granted to gated subnets!</p>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#1d9aef] w-[85%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-400">
              {mounted ? "Connect to calculate your FairScale score." : "Loading reputation..."}
            </div>
          )}
        </div>
        
        <div className="h-px bg-zinc-900 w-full my-2"></div>
        
        {mounted && <WhoToFollow />}
      </div>
      
    </aside>
  )
}
