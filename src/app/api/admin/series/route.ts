import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE - Add new series
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      title,
      titleAlt,
      author,
      artist,
      description,
      coverImage,
      status,
      licenseStatus,
      allowOfflineDownload,
    } = body

    // Validate required fields
    if (!title || !author || !artist || !description || !coverImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create series in database
    const series = await prisma.series.create({
      data: {
        title,
        titleAlt: titleAlt || null,
        author,
        artist,
        description,
        coverImage,
        status: status || 'ongoing',
        licenseStatus: licenseStatus || 'original',
        allowOfflineDownload: allowOfflineDownload ?? false,
      },
    })

    return NextResponse.json({
      success: true,
      data: series,
      message: 'Series created successfully',
    })
  } catch (error) {
    console.error('Error creating series:', error)
    return NextResponse.json(
      { error: 'Failed to create series' },
      { status: 500 }
    )
  }
}

// UPDATE - Update existing series
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Series ID is required' },
        { status: 400 }
      )
    }

    const series = await prisma.series.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: series,
      message: 'Series updated successfully',
    })
  } catch (error) {
    console.error('Error updating series:', error)
    return NextResponse.json(
      { error: 'Failed to update series' },
      { status: 500 }
    )
  }
}

// DELETE - Delete series
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Series ID is required' },
        { status: 400 }
      )
    }

    // Delete series (cascade will delete chapters too)
    await prisma.series.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Series deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting series:', error)
    return NextResponse.json(
      { error: 'Failed to delete series' },
      { status: 500 }
    )
  }
}
