import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'

export interface PostProps {
  id: string
  author: {
    username: string
    avatarUrl?: string
    walletAddress: string
  }
  content: string
  subnet?: string
  likesCount: number
  commentsCount: number
  createdAt: string
  isLiked?: boolean
  onLike?: () => void
}

export function PostCard({ post }: { post: PostProps }) {
  return (
    <Card className="bg-zinc-950/50 backdrop-blur-md border-zinc-800/80 hover:border-zinc-700 transition-colors mb-4 rounded-xl overflow-hidden shadow-lg shadow-black/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 ring-2 ring-zinc-800 ring-offset-2 ring-offset-black">
            {post.author.avatarUrl ? (
              <Image src={post.author.avatarUrl} alt={post.author.username} fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.author.username.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-100 truncate">{post.author.username}</span>
                <span className="text-sm text-zinc-500 truncate max-w-[120px]">
                  {post.author.walletAddress.slice(0,4)}...{post.author.walletAddress.slice(-4)}
                </span>
                <span className="text-xs text-zinc-600 px-1">•</span>
                <span className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              {post.subnet && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 whitespace-nowrap">
                  {post.subnet}
                </Badge>
              )}
            </div>

            <div className="text-zinc-300 mt-2 mb-4 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {post.content}
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-900/50">
              <button 
                onClick={post.onLike}
                className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-pink-400'}`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likesCount}</span>
              </button>
              
              <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-400 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentsCount}</span>
              </button>

              <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors ml-auto">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
