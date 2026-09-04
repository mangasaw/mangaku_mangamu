import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all series
export async function GET() {
  try {
    const series = await prisma.series.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        coverImage: true,
        status: true,
      }
    })

    return NextResponse.json({ series })
  } catch (error) {
    console.error('Error fetching series:', error)
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    )
  }
}
