import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE - Add new chapter
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      seriesId,
      chapterNumber,
      title,
      images,
    } = body

    // Validate required fields
    if (!seriesId || !chapterNumber || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields. seriesId, chapterNumber, and images are required' },
        { status: 400 }
      )
    }

    // Check if chapter already exists
    const existingChapter = await prisma.chapter.findUnique({
      where: {
        seriesId_chapterNumber: {
          seriesId,
          chapterNumber: parseFloat(chapterNumber),
        },
      },
    })

    if (existingChapter) {
      return NextResponse.json(
        { error: 'Chapter with this number already exists for this series' },
        { status: 409 }
      )
    }

    // Create chapter in database
    const chapter = await prisma.chapter.create({
      data: {
        seriesId,
        chapterNumber: parseFloat(chapterNumber),
        title: title || null,
        images: images,
        isTakedown: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: chapter,
      message: 'Chapter created successfully',
    })
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}

// UPDATE - Update existing chapter
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      )
    }

    // If updating chapterNumber, convert to float
    if (updateData.chapterNumber) {
      updateData.chapterNumber = parseFloat(updateData.chapterNumber)
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: chapter,
      message: 'Chapter updated successfully',
    })
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

// DELETE - Delete chapter
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      )
    }

    // Delete chapter
    await prisma.chapter.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Chapter deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
