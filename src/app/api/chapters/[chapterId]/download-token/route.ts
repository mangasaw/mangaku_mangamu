import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock check: series allows offline download
    // Di production, cek dari database: series.allowOfflineDownload
    const allowOfflineDownload = true

    if (!allowOfflineDownload) {
      return NextResponse.json(
        { error: 'Series ini tidak tersedia untuk offline reading' },
        { status: 403 }
      )
    }

    // Generate download token (valid for 7 days)
    const downloadToken = {
      id: `token-${Date.now()}`,
      userId,
      chapterId: params.chapterId,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked: false,
    }

    return NextResponse.json({
      data: downloadToken,
      message: 'Download token issued successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to issue download token' },
      { status: 500 }
    )
  }
}
