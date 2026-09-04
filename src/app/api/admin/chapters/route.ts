import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST create new chapter
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { seriesId, chapterNumber, title, images } = body

    if (!seriesId || !chapterNumber || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if chapter already exists
    const existing = await prisma.chapter.findUnique({
      where: {
        seriesId_chapterNumber: {
          seriesId,
          chapterNumber: parseFloat(chapterNumber)
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: `Chapter ${chapterNumber} already exists` },
        { status: 409 }
      )
    }

    const chapter = await prisma.chapter.create({
      data: {
        seriesId,
        chapterNumber: parseFloat(chapterNumber),
        title: title || null,
        images,
      }
    })

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
