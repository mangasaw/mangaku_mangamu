import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET chapter details
export async function GET(
  request: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          }
        }
      }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.chapter.update({
      where: { id: params.chapterId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}
