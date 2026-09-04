import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET active ad for a specific position
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const position = searchParams.get('position')

    if (!position) {
      return NextResponse.json({ error: 'Position required' }, { status: 400 })
    }

    // Get random active ad for this position
    const ads = await prisma.ad.findMany({
      where: {
        position: position as any,
        isActive: true,
      },
    })

    if (ads.length === 0) {
      return NextResponse.json({ ad: null })
    }

    // Random selection for ad rotation
    const randomAd = ads[Math.floor(Math.random() * ads.length)]

    return NextResponse.json({ ad: randomAd })
  } catch (error) {
    console.error('Error fetching active ad:', error)
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
