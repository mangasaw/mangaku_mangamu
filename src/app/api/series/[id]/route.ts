import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock data - nanti akan diganti dengan database
  const mockSeries = {
    id: params.id,
    title: `Manga Title ${params.id}`,
    titleAlt: 'Alternative Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    coverImage: '/covers/default.jpg',
    author: 'John Doe',
    artist: 'Jane Smith',
    status: 'ongoing',
    licenseStatus: 'original',
    allowOfflineDownload: true,
    genres: ['Action', 'Adventure', 'Fantasy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ data: mockSeries })
}
