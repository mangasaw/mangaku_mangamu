import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET single ad - Admin only
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id }
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 })
  }
}

// PUT update ad - Admin only
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
    const { name, code, position, isActive } = body

    // Validation
    if (!name || typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: 'Invalid name (max 100 characters)' }, { status: 400 })
    }

    if (!code || typeof code !== 'string' || code.length > 10000) {
      return NextResponse.json({ error: 'Invalid code (max 10000 characters)' }, { status: 400 })
    }

    const validPositions = ['HEADER', 'SIDEBAR_LEFT', 'SIDEBAR_RIGHT', 'BEFORE_CONTENT', 'AFTER_CONTENT', 'FOOTER', 'INLINE']
    if (!validPositions.includes(position)) {
      return NextResponse.json({ error: 'Invalid position' }, { status: 400 })
    }

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: {
        name,
        code,
        position,
        isActive,
      }
    })

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 })
  }
}

// DELETE ad - Admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

  try {
    await prisma.ad.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Ad deleted successfully' })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 })
  }
}
