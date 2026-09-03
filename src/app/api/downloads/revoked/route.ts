import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  // Mock data - di production, query dari database
  // SELECT chapter_id FROM download_tokens 
  // WHERE user_id = ? AND revoked = true
  // UNION
  // SELECT chapters.id FROM chapters 
  // JOIN download_tokens ON chapters.id = download_tokens.chapter_id
  // WHERE download_tokens.user_id = ? AND chapters.is_takedown = true

  const revokedChapters = [
    // Mock: tidak ada chapter yang direvoke untuk demo
    // 'chapter-1-5', // contoh: chapter yang kena takedown
  ]

  return NextResponse.json({
    data: {
      revokedChapterIds: revokedChapters,
      checkedAt: new Date().toISOString(),
    },
  })
}
