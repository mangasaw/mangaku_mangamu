import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single popup
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

// PUT update popup
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, mediaUrl, mediaType, linkUrl, isActive, showInterval, displayDuration, autoClose } = body

    const popup = await prisma.popup.update({
      where: { id: params.id },
      data: {
        title,
        mediaUrl,
        mediaType,
        linkUrl,
        isActive,
        showInterval,
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

// DELETE popup
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
