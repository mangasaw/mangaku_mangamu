import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, progressData } = body

    if (!userId || !progressData || !Array.isArray(progressData)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Mock sync - di production, batch upsert ke database (library table)
    // UPDATE library SET last_read_chapter_id, last_read_page, scroll_position, updated_at
    // WHERE user_id = ? AND series_id = ?

    const syncedProgress = progressData.map(progress => ({
      ...progress,
      synced: true,
      syncedAt: new Date().toISOString(),
    }))

    return NextResponse.json({
      data: syncedProgress,
      message: `Successfully synced ${progressData.length} reading progress records`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync reading progress' },
      { status: 500 }
    )
  }
}
