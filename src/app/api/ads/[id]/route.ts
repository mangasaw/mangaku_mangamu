import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single ad
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id }
    })

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad' },
      { status: 500 }
    )
  }
}

// PUT update ad
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, code, position, isActive } = body

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(position !== undefined && { position }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json(
      { error: 'Failed to update ad' },
      { status: 500 }
    )
  }
}

// DELETE ad
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ad.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    )
  }
}
