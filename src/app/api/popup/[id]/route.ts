import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET single popup - Admin only
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    const popup = await prisma.popup.findUnique({
      where: { id: params.id }
    })

    if (!popup) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 })
    }

    return NextResponse.json({ popup })
  } catch (error) {
    console.error('Error fetching popup:', error)
    return NextResponse.json({ error: 'Failed to fetch popup' }, { status: 500 })
  }
}

// PUT update popup - Admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const popup = await prisma.popup.update({
      where: { id: params.id },
      data: {
        title: title || null,
        mediaUrl,
        mediaType,
        linkUrl: linkUrl || null,
        isActive,
        showInterval: showInterval || null,
        displayDuration,
        autoClose,
      }
    })

    return NextResponse.json({ popup })
  } catch (error) {
    console.error('Error updating popup:', error)
    return NextResponse.json({ error: 'Failed to update popup' }, { status: 500 })
  }
}

// DELETE popup - Admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    await prisma.popup.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Popup deleted successfully' })
  } catch (error) {
    console.error('Error deleting popup:', error)
    return NextResponse.json({ error: 'Failed to delete popup' }, { status: 500 })
  }
}
