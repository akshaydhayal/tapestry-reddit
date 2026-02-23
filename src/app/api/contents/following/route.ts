import { socialfi } from '@/utils/socialfi'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Owner wallet address is required' },
      { status: 400 },
    )
  }

  try {
    console.log(`[Following API] Fetching for wallet: ${walletAddress}`)
    
    // 1. Resolve actual Tapestry Profile ID from Wallet Address
    let profileId = ''
    const identityUrl = `https://api.usetapestry.dev/api/v1/identities/${walletAddress}?apiKey=${process.env.TAPESTRY_API_KEY || ''}`
    const identityRes = await fetch(identityUrl, { cache: 'no-store' })
    
    if (identityRes.ok) {
      const identityData = await identityRes.json()
      // Extract the first profile id found in the identities
      const possibleId = identityData?.identities?.[0]?.profiles?.[0]?.profile?.id
      if (possibleId) {
        profileId = possibleId
        console.log(`[Following API] Resolved Profile ID: ${profileId}`)
      }
    }

    if (!profileId) {
      console.warn(`[Following API] No Profile ID found for wallet: ${walletAddress}`)
      return NextResponse.json({ contents: [] })
    }

    // 2. Fetch the list of profiles the user follows
    const followingResponse = await socialfi.profiles.followingList({
      id: profileId,
      apiKey: process.env.TAPESTRY_API_KEY || '',
    })

    const followingIds = new Set(
      (followingResponse.profiles || [])
        .map((p: any) => p.id || p.profile?.id) // Support both top-level and nested just in case
        .filter(Boolean)
    )

    console.log(`[Following API] Found ${followingIds.size} unique following IDs:`, Array.from(followingIds))

    if (followingIds.size === 0) {
      return NextResponse.json({ contents: [] })
    }

    // 3. Fetch contents (Try using identifier for native filtering first, then fallback to manual)
    const contentUrl = `https://api.usetapestry.dev/api/v1/contents/?apiKey=${process.env.TAPESTRY_API_KEY || ''}&t=${Date.now()}`
    
    const contentRes = await fetch(contentUrl, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (!contentRes.ok) {
        const errText = await contentRes.text()
        throw new Error(`Tapestry Content Fetch Error: ${contentRes.status} - ${errText}`)
    }

    const allData = await contentRes.json()
    const allPosts = allData.contents || []
    console.log(`[Following API] Fetched ${allPosts.length} global posts to filter.`)

    // 4. Manually filter global contents for followed users
    const filteredContents = allPosts.filter((item: any) => {
        const authorId = item.authorProfile?.id
        const isMatch = authorId && followingIds.has(authorId)
        if (isMatch) console.log(`[Following API] Match found: Post ${item.content?.id} by ${item.authorProfile?.username} (${authorId})`)
        return isMatch
    })

    console.log(`[Following API] Returning ${filteredContents.length} filtered posts.`)
    return NextResponse.json({ contents: filteredContents })
  } catch (error: any) {
    console.error('[Following API] Critical Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch following feed' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
