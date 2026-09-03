import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock chapters data
  const mockChapters = Array.from({ length: 50 }, (_, i) => ({
    id: `chapter-${params.id}-${i + 1}`,
    seriesId: params.id,
    chapterNumber: i + 1,
    title: `Chapter ${i + 1}`,
    images: Array.from({ length: 20 }, (_, j) => 
      `/images/manga-${params.id}/chapter-${i + 1}/page-${j + 1}.jpg`
    ),
    isTakedown: false,
    createdAt: new Date(Date.now() - (49 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (49 - i) * 86400000).toISOString(),
  }))

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const start = (page - 1) * limit
  const end = start + limit
  const paginatedChapters = mockChapters.slice(start, end)

  return NextResponse.json({
    data: paginatedChapters,
    pagination: {
      page,
      limit,
      total: mockChapters.length,
      totalPages: Math.ceil(mockChapters.length / limit),
    },
  })
}
