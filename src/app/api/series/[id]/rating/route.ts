import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// GET rating for a series
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    // Get series rating stats
    const series = await prisma.series.findUnique({
      where: { id: params.id },
      select: {
        averageRating: true,
        totalRatings: true,
      },
    })

    // Get user's rating if logged in
    let userRating = null
    if (token) {
      userRating = await prisma.rating.findUnique({
        where: {
          userId_seriesId: {
            userId: token.id as string,
            seriesId: params.id,
          },
        },
      })
    }

    return NextResponse.json({ 
      series,
      userRating,
    })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
  }
}

// POST/PUT rating
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { rating, review } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (review && review.length > 2000) {
      return NextResponse.json({ error: 'Review too long (max 2000 characters)' }, { status: 400 })
    }

    // Upsert rating
    const userRating = await prisma.rating.upsert({
      where: {
        userId_seriesId: {
          userId: token.id as string,
          seriesId: params.id,
        },
      },
      update: {
        rating,
        review: review || null,
      },
      create: {
        userId: token.id as string,
        seriesId: params.id,
        rating,
        review: review || null,
      },
    })

    // Recalculate average rating
    const ratings = await prisma.rating.findMany({
      where: { seriesId: params.id },
      select: { rating: true },
    })

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0

    await prisma.series.update({
      where: { id: params.id },
      data: {
        averageRating,
        totalRatings: ratings.length,
      },
    })

    return NextResponse.json({ rating: userRating })
  } catch (error) {
    console.error('Error saving rating:', error)
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 })
  }
}

// DELETE rating
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.rating.delete({
      where: {
        userId_seriesId: {
          userId: token.id as string,
          seriesId: params.id,
        },
      },
    })

    // Recalculate average rating
    const ratings = await prisma.rating.findMany({
      where: { seriesId: params.id },
      select: { rating: true },
    })

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0

    await prisma.series.update({
      where: { id: params.id },
      data: {
        averageRating,
        totalRatings: ratings.length,
      },
    })

    return NextResponse.json({ message: 'Rating deleted' })
  } catch (error) {
    console.error('Error deleting rating:', error)
    return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 })
  }
}
