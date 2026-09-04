import { NextResponse } from 'next/server'

// Mock data - nanti akan diganti dengan database
const mockSeries = [
  {
    id: '1',
    title: 'One Piece',
    titleAlt: 'ワンピース',
    description: 'Monkey D. Luffy dan krunya berlayar mencari harta karun legendaris One Piece.',
    coverImage: '/covers/onepiece.jpg',
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    status: 'ongoing',
    licenseStatus: 'original',
    allowOfflineDownload: true,
  },
  {
    id: '2',
    title: 'Naruto',
    titleAlt: 'ナルト',
    description: 'Naruto Uzumaki ingin menjadi Hokage terkuat di desanya.',
    coverImage: '/covers/naruto.jpg',
    author: 'Masashi Kishimoto',
    artist: 'Masashi Kishimoto',
    status: 'completed',
    licenseStatus: 'partnership',
    allowOfflineDownload: true,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  let filteredSeries = [...mockSeries]

  if (query) {
    filteredSeries = filteredSeries.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (status) {
    filteredSeries = filteredSeries.filter(s => s.status === status)
  }

  const start = (page - 1) * limit
  const end = start + limit
  const paginatedSeries = filteredSeries.slice(start, end)

  return NextResponse.json({
    data: paginatedSeries,
    pagination: {
      page,
      limit,
      total: filteredSeries.length,
      totalPages: Math.ceil(filteredSeries.length / limit),
    },
  })
}
