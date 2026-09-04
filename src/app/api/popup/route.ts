import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all popups
export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ popups })
  } catch (error) {
    console.error('Error fetching popups:', error)
    return NextResponse.json({ error: 'Failed to fetch popups' }, { status: 500 })
  }
}

// POST create new popup
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, mediaUrl, mediaType, linkUrl, isActive, showInterval, displayDuration, autoClose } = body

    const popup = await prisma.popup.create({
      data: {
        title,
        mediaUrl,
        mediaType,
        linkUrl,
        isActive: isActive || false,
        showInterval,
        displayDuration: displayDuration || 5,
        autoClose: autoClose !== undefined ? autoClose : true,
      }
    })

    return NextResponse.json({ popup }, { status: 201 })
  } catch (error) {
    console.error('Error creating popup:', error)
    return NextResponse.json({ error: 'Failed to create popup' }, { status: 500 })
  }
}
