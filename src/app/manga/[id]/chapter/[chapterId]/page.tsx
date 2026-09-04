'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MangaPage } from '@/components/OptimizedImage'
import { useImagePreloader } from '@/components/LazyLoad'

export default function ChapterReaderPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [chapter, setChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch chapter data
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(`/api/chapters/${params.chapterId}`)
        const data = await res.json()
        setChapter(data.chapter)
      } catch (error) {
        console.error('Error fetching chapter:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [params.chapterId])

  // Preload next 3 images
  const currentImages = chapter?.images || []
  const nextImages = currentImages.slice(currentPage, currentPage + 3)
  const { loadedCount } = useImagePreloader(nextImages, 3)

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.chapterId])

  // Track current page based on scroll
  useEffect(() => {
    if (!chapter?.images) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      const pageElements = document.querySelectorAll('[data-page]')
      
      pageElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementBottom = elementTop + rect.height
        
        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          setCurrentPage(index + 1)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [chapter])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Chapter not found</p>
          <Link href={`/manga/${params.id}`} className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
            Back to manga
          </Link>
        </div>
      </div>
    )
  }

  const totalPages = chapter.images?.length || 0

  return (
    <div className="min-h-screen bg-black">
      {/* Reader Header */}
      <div className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/manga/${params.id}`}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="font-semibold">{chapter.series?.title || 'Manga Title'}</h1>
                <p className="text-sm text-gray-400">Chapter {chapter.chapterNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Page {currentPage} / {totalPages}
              </span>
              <button className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700 text-sm">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-2">
          {chapter.images?.map((imageUrl: string, i: number) => (
            <div 
              key={i}
              data-page={i + 1}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <MangaPage
                src={imageUrl}
                alt={`Page ${i + 1}`}
                pageNumber={i + 1}
                priority={i < 2} // Prioritize first 2 pages
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between bg-gray-900 rounded-lg p-4">
          <Link
            href={`/manga/${params.id}/chapter/${parseInt(params.chapterId) - 1}`}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Previous Chapter
          </Link>
          
          <Link
            href={`/manga/${params.id}`}
            className="px-6 py-2 border border-gray-700 text-white rounded hover:bg-gray-800"
          >
            Chapter List
          </Link>
          
          <Link
            href={`/manga/${params.id}/chapter/${parseInt(params.chapterId) + 1}`}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Next Chapter
          </Link>
        </div>
      </div>

      {/* Reading Progress Auto-save indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
        {loadedCount > 0 && `Preloading ${loadedCount}/3...`}
      </div>
    </div>
  )
}
