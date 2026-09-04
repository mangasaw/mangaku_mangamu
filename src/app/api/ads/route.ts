import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AdPosition } from '@prisma/client'

// GET all ads
export async function GET(request: Request) {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

// POST create new ad
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, position, isActive } = body

    if (!name || !code || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate position
    if (!Object.values(AdPosition).includes(position)) {
      return NextResponse.json(
        { error: 'Invalid ad position' },
        { status: 400 }
      )
    }

    const ad = await prisma.ad.create({
      data: {
        name,
        code,
        position: position as AdPosition,
        isActive: isActive ?? true,
      }
    })

    return NextResponse.json({ ad }, { status: 201 })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    )
  }
}
