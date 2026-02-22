import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const url = `https://api.usetapestry.dev/api/v1/contents/${id}?apiKey=${process.env.TAPESTRY_API_KEY || ''}`

    const res = await fetch(url)

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to fetch post details: ${res.status} ${res.statusText} - ${errorText}`)
    }

    const response = await res.json()
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching post details:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post details' },
      { status: 500 }
    )
  }
}
