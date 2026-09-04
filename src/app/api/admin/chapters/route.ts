import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST create new chapter
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { seriesId, chapterNumber, title, images, isPremium } = body

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
        isPremium: isPremium || false,
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

// PUT update chapter
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, chapterNumber, title, images, isPremium, isTakedown } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Chapter ID required' },
        { status: 400 }
      )
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...(chapterNumber !== undefined && { chapterNumber: parseFloat(chapterNumber) }),
        ...(title !== undefined && { title }),
        ...(images !== undefined && { images }),
        ...(isPremium !== undefined && { isPremium }),
        ...(isTakedown !== undefined && { isTakedown }),
      }
    })

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

// DELETE chapter
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Chapter ID required' },
        { status: 400 }
      )
    }

    await prisma.chapter.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
