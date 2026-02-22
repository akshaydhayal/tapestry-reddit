'use client'

import { Feed } from '@/components/feed/feed'
import { CreatePost } from '@/components/feed/create-post'
import { PostProps } from '@/components/feed/post-card'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Globe, Users } from 'lucide-react'

// Dummy data for visual presentation before Tapestry integration
const initialDummyPosts: PostProps[] = [
  {
    id: '1',
    author: {
      username: 'AliceChain',
      walletAddress: 'Aa11111111111111111111111111111111111111112',
    },
    content: "Just deployed my first smart contract on Solana Mainnet! 🚀 The speed and low fees are incredible. Who else is building today?",
    subnet: '#SolanaDevs',
    likesCount: 142,
    commentsCount: 23,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    author: {
      username: 'DeFi_Degen',
      walletAddress: 'Bb22222222222222222222222222222222222222223',
    },
    content: "If you're not paying attention to the new lending protocols launching this week, you're missing out on massive yield. 📈 NFA.",
    subnet: '#DeFiDegens',
    likesCount: 89,
    commentsCount: 12,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    author: {
      username: 'NFTWhale.sol',
      walletAddress: 'Cc33333333333333333333333333333333333333334',
    },
    content: "Swept the floor on Mad Lads today. The community is unmatched.",
    subnet: '#NFTWhales',
    likesCount: 456,
    commentsCount: 89,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
]

export default function HomeFeedPage() {
  const [posts, setPosts] = useState<PostProps[]>(initialDummyPosts)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedType, setFeedType] = useState<'following' | 'global'>('global')
  const { connected } = useWallet()

  const handlePostSubmit = (content: string, subnet: string) => {
    setIsSubmitting(true)
    // Simulate API call delay
    setTimeout(() => {
      const newPost: PostProps = {
        id: Math.random().toString(),
        author: {
          username: 'You (Demo)',
          walletAddress: 'YourWalletAddress123...',
        },
        content,
        subnet,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
      }
      setPosts([newPost, ...posts])
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar / Left Column (Visible on Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col fixed h-screen pt-4 border-r border-zinc-800 px-4">
        <h2 className="text-xl font-bold mb-6 text-zinc-100 px-2">Feeds</h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setFeedType('global')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${feedType === 'global' ? 'bg-indigo-600 shadow-indigo-500/20 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
          >
            <Globe className="h-5 w-5" />
            <span className="font-medium text-lg">Global</span>
          </button>
          <button 
            onClick={() => setFeedType('following')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${feedType === 'following' ? 'bg-indigo-600 shadow-indigo-500/20 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
            disabled={!connected}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium text-lg">Following</span>
          </button>
        </nav>
        
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">Popular Subnets</h3>
          <ul className="flex flex-col gap-2">
            {[
              {tag: 'SolanaDevs', gate: 'Rep > 100'}, 
              {tag: 'DeFiDegens', gate: 'Public'}, 
              {tag: 'NFTWhales', gate: 'NFT Req'}
            ].map(sub => (
              <li key={sub.tag}>
                <a href={`/r/${sub.tag}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 group cursor-pointer">
                  <span className="text-zinc-300 group-hover:text-purple-400 transition-colors">#{sub.tag}</span>
                  <span className="text-xs text-zinc-600 font-mono bg-zinc-950 px-1.5 py-0.5 rounded">{sub.gate}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Feed Content */}
      <main className="flex-1 lg:ml-64 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 lg:hidden flex gap-4 border-b border-zinc-800 pb-4">
          <button 
            onClick={() => setFeedType('global')}
            className={`pb-2 border-b-2 font-medium ${feedType === 'global' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setFeedType('following')}
            className={`pb-2 border-b-2 font-medium ${feedType === 'following' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500'}`}
          >
            Following
          </button>
        </header>

        <CreatePost onSubmit={handlePostSubmit} isLoading={isSubmitting} />
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {feedType === 'global' ? '🌎 Global Feed' : '👥 Following'}
          </h2>
          <Feed posts={posts} />
        </div>
      </main>

      {/* Right Column / Suggested (Visible on Desktop) */}
      <aside className="hidden xl:block w-80 pl-8 pt-8 relative">
        <div className="sticky top-8 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <h3 className="font-bold text-lg mb-4 text-zinc-100">Your Reputation</h3>
          {connected ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">842</span>
                <span className="text-zinc-500 mb-1 font-medium">FairScore</span>
              </div>
              <p className="text-sm text-zinc-400">You are in the top 5% of active Solana wallets. You have access to all gated subnets!</p>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 w-[85%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-400">
              Connect your wallet to calculate your on-chain FairScale reputation score and unlock gated communities.
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
