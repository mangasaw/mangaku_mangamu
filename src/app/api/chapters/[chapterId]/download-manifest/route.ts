import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { chapterId: string } }
) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Download token is required' },
      { status: 400 }
    )
  }

  // Mock validation - di production, verify token dari database
  // Cek apakah token valid, belum expired, dan belum revoked

  // Generate manifest untuk download
  const manifest = {
    chapterId: params.chapterId,
    totalPages: 20,
    estimatedSize: 45 * 1024 * 1024, // 45 MB
    pages: Array.from({ length: 20 }, (_, i) => ({
      order: i + 1,
      url: `/api/chapters/${params.chapterId}/download-page?page=${i + 1}&token=${token}`,
      checksum: `sha256-${Math.random().toString(36).substring(7)}`, // Mock checksum
      width: 800,
      height: 1200,
    })),
  }

  return NextResponse.json({ data: manifest })
}
