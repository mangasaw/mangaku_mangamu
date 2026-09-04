import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { chapterId: string } }
) {
  // Mock chapter detail
  const mockChapter = {
    id: params.chapterId,
    seriesId: '1',
    chapterNumber: 1,
    title: 'Chapter 1',
    images: Array.from({ length: 20 }, (_, i) => 
      `/images/chapter-${params.chapterId}/page-${i + 1}.jpg`
    ),
    isTakedown: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ data: mockChapter })
}
