import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET all ads - Admin only
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'Unauthorized' ? 401 : 403 })
  }

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

// POST create new ad - Admin only
export async function POST(req: NextRequest) {
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
