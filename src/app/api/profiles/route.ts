import { socialfi } from '@/utils/socialfi'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'walletAddress is required' },
      { status: 400 },
    )
  }

  try {
    const url = `https://api.usetapestry.dev/api/v1/profiles?walletAddress=${walletAddress}&apiKey=${process.env.TAPESTRY_API_KEY || ''}`
    
    const res = await fetch(url)
    
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Tapestry Profile Fetch Error: ${res.status} ${res.statusText} - ${errorText}`)
    }

    const response = await res.json()
    return NextResponse.json(response)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching profiles:', error.message)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch profiles' },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 },
    )
  }
}
