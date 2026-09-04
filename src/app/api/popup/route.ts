import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET all popups - Admin only
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

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

// POST create new popup - Admin only
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    const body = await req.json()
    const { title, mediaUrl, mediaType, linkUrl, isActive, showInterval, displayDuration, autoClose } = body

    // Validation
    if (!mediaUrl || typeof mediaUrl !== 'string' || mediaUrl.length > 500) {
      return NextResponse.json({ error: 'Invalid mediaUrl' }, { status: 400 })
    }

    if (!['IMAGE', 'GIF', 'VIDEO'].includes(mediaType)) {
      return NextResponse.json({ error: 'Invalid mediaType' }, { status: 400 })
    }

    if (title && title.length > 200) {
      return NextResponse.json({ error: 'Title too long' }, { status: 400 })
    }

    if (linkUrl && (typeof linkUrl !== 'string' || linkUrl.length > 500)) {
      return NextResponse.json({ error: 'Invalid linkUrl' }, { status: 400 })
    }

    if (displayDuration !== undefined && (typeof displayDuration !== 'number' || displayDuration < 0 || displayDuration > 300)) {
      return NextResponse.json({ error: 'Invalid displayDuration (0-300 seconds)' }, { status: 400 })
    }

    if (showInterval !== undefined && showInterval !== null && (typeof showInterval !== 'number' || showInterval < 0)) {
      return NextResponse.json({ error: 'Invalid showInterval' }, { status: 400 })
    }

    const popup = await prisma.popup.create({
      data: {
        title: title || null,
        mediaUrl,
        mediaType,
        linkUrl: linkUrl || null,
        isActive: isActive || false,
        showInterval: showInterval || null,
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
