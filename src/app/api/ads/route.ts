import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all ads
export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

// POST create new ad
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, position, isActive } = body

    const ad = await prisma.ad.create({
      data: {
        name,
        code,
        position,
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json({ ad }, { status: 201 })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
  }
}
