'use client'

import { Feed } from '@/components/feed/feed'
import { CreatePost } from '@/components/feed/create-post'
import { PostProps } from '@/components/feed/post-card'
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Dummy data specific to a subnet
const generateDummyPosts = (subnet: string): PostProps[] => [
  {
    id: '1',
    author: {
      username: 'SubnetCreator',
      walletAddress: 'Zz999999999999999999999999999999999999999',
    },
    content: `Welcome to the official #${subnet} subnet! 🚀 Let's start building and sharing.`,
    subnet: `#${subnet}`,
    likesCount: 12,
    commentsCount: 2,
    createdAt: new Date().toISOString()
  }
]

// Mock FairScale configurations
const SUBNET_GATES: Record<string, { minScore: number, desc: string }> = {
  'SolanaDevs': { minScore: 100, desc: 'Requires FairScore > 100 to prove developer activity.' },
  'NFTWhales': { minScore: 500, desc: 'Requires FairScore > 500 or specific NFT holdings.' },
  'DeFiDegens': { minScore: 0, desc: 'Open to everyone.' }
}

export default function SubnetPage() {
  const params = useParams()
  const subnet = typeof params.subnet === 'string' ? params.subnet : 'unknown'
  const [posts, setPosts] = useState<PostProps[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { connected, publicKey } = useWallet()
  
  // Mock user's FairScore
  const [userScore, setUserScore] = useState<number | null>(null)
  
  useEffect(() => {
    // Determine the criteria
    const criteria = SUBNET_GATES[subnet] || { minScore: 0, desc: 'Open to everyone.' }
    
    // Simulate fetching the FairScale score when authenticated
    if (connected) {
      // Mock score of 842 for demonstration (allows access to all)
      // In a real app, you would fetch from FairScale API here
      setTimeout(() => setUserScore(842), 500)
    } else {
      setUserScore(null)
    }
    
    // Load posts if public or if we have a score that passes
    if (criteria.minScore === 0 || (userScore !== null && userScore >= criteria.minScore)) {
      setPosts(generateDummyPosts(subnet))
    }
  }, [subnet, connected, userScore])

  const criteria = SUBNET_GATES[subnet] || { minScore: 0, desc: 'Open to everyone.' }
  const isLocked = criteria.minScore > 0 && (userScore === null || userScore < criteria.minScore)

  const handlePostSubmit = async (content: string) => {
    if (!connected || !publicKey) return
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          subnet: `#${subnet}`,
          ownerWalletAddress: publicKey.toBase58(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const newPost: PostProps = {
        id: Math.random().toString(),
        author: {
          username: 'You',
          walletAddress: publicKey.toBase58(),
        },
        content,
        subnet: `#${subnet}`,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
      }
      setPosts([newPost, ...posts])
    } catch (error) {
      console.error(error)
      alert("Failed to submit post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <main className="max-w-2xl w-full mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Global Feed</span>
          </Link>
          
          <div className="text-right">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              #{subnet}
            </h1>
            <p className="text-xs text-zinc-500 font-mono tracking-wider mt-1 uppercase">Members: {Math.floor(Math.random() * 1000) + 100}</p>
          </div>
        </div>

        {isLocked ? (
          <div className="mt-12 p-8 border border-zinc-800 bg-zinc-950/50 backdrop-blur-md rounded-2xl text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50" />
            <LockKeyhole className="h-16 w-16 mx-auto text-zinc-600 mb-6 relative z-10" />
            <h2 className="text-2xl font-bold mb-4 relative z-10">Access Restricted</h2>
            <p className="text-zinc-400 mb-6 relative z-10 max-w-md mx-auto">
              This subnet is gated by FairScale reputation. <br/>
              <span className="text-purple-400 font-medium">{criteria.desc}</span>
            </p>
            {!connected ? (
              <p className="text-sm text-zinc-500 relative z-10">Please log in to calculate your on-chain score.</p>
            ) : (
              <div className="bg-zinc-900 rounded-xl p-4 inline-block relative z-10 border border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">Your Current Score:</p>
                <p className="text-3xl font-black text-white">{userScore !== null ? userScore : 'Calculating...'}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CreatePost onSubmit={handlePostSubmit} isLoading={isSubmitting} />
            <div className="mt-8">
              <Feed posts={posts} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
