'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { MangaPage } from '@/components/OptimizedImage'
import { useImagePreloader } from '@/components/LazyLoad'
import { useReadingMode } from '@/contexts/ReadingModeContext'
import { ReadingModeSelector } from '@/components/ReadingModeSelector'
import { ChapterStartAd, InlineAd, ChapterEndAd } from '@/components/AdComponent'
import { useGestures, useMouseGestures } from '@/hooks/useGestures'

export default function ChapterReaderPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [chapter, setChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const { mode, autoNext } = useReadingMode()
  const readerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  // Calculate total pages
  const totalPages = chapter?.images?.length || 0

  // Track current page based on scroll (for vertical/webtoon mode)
  useEffect(() => {
    if (!chapter?.images || mode === 'horizontal' || mode === 'double-page') return

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
  }, [chapter, mode])

  // Handle horizontal navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    
    if (mode === 'horizontal' || mode === 'double-page') {
      const element = document.querySelector(`[data-page="${page}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    } else if (autoNext) {
      // Auto go to next chapter
      window.location.href = `/manga/${params.id}/chapter/${parseInt(params.chapterId) + 1}`
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrevPage()
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setShowSettings(!showSettings)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, mode, showSettings])

  // Gesture controls
  useGestures(contentRef, {
    onSwipeLeft: () => {
      if (mode === 'horizontal' || mode === 'double-page') {
        handleNextPage()
      }
    },
    onSwipeRight: () => {
      if (mode === 'horizontal' || mode === 'double-page') {
        handlePrevPage()
      }
    },
    onTap: () => {
      setShowSettings(!showSettings)
    },
    onDoubleTap: () => {
      // Toggle zoom
      setZoomLevel(zoomLevel === 1 ? 1.5 : 1)
    },
    onPinchIn: () => {
      setZoomLevel(Math.max(0.5, zoomLevel - 0.1))
    },
    onPinchOut: () => {
      setZoomLevel(Math.min(3, zoomLevel + 0.1))
    }
  })

  // Mouse gestures for desktop
  useMouseGestures(contentRef, {
    onTap: () => {
      // Toggle settings on click
    },
    onDoubleTap: () => {
      setZoomLevel(zoomLevel === 1 ? 1.5 : 1)
    },
    onPinchIn: () => {
      setZoomLevel(Math.max(0.5, zoomLevel - 0.1))
    },
    onPinchOut: () => {
      setZoomLevel(Math.min(3, zoomLevel + 0.1))
    }
  })

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

  // Render content based on reading mode
  const renderContent = () => {
    switch (mode) {
      case 'horizontal':
        return (
          <div 
            ref={contentRef}
            className="flex overflow-x-auto snap-x snap-mandatory h-screen scrollbar-hide" 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            {chapter.images?.map((imageUrl: string, i: number) => (
              <div 
                key={i}
                data-page={i + 1}
                className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center bg-black"
              >
                <MangaPage
                  src={imageUrl}
                  alt={`Page ${i + 1}`}
                  pageNumber={i + 1}
                  priority={i < 2}
                />
                {(i + 1) % 5 === 0 && <InlineAd pageNumber={i + 1} />}
              </div>
            ))}
          </div>
        )
      
      case 'double-page':
        const pages = chapter.images || []
        const pairs = []
        for (let i = 0; i < pages.length; i += 2) {
          pairs.push(pages.slice(i, i + 2))
        }
        
        return (
          <div 
            ref={contentRef}
            className="flex overflow-x-auto snap-x snap-mandatory h-screen scrollbar-hide"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            {pairs.map((pair, pairIndex) => (
              <div 
                key={pairIndex}
                data-page={(pairIndex * 2) + 1}
                className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center bg-black gap-1"
              >
                {pair.map((imageUrl: string, idx: number) => (
                  <div key={idx} className="flex-1 h-full flex items-center justify-center">
                    <MangaPage
                      src={imageUrl}
                      alt={`Page ${(pairIndex * 2) + idx + 1}`}
                      pageNumber={(pairIndex * 2) + idx + 1}
                      priority={pairIndex === 0}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      
      case 'webtoon':
        return (
          <div 
            ref={contentRef}
            className="max-w-full mx-auto bg-black"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            <ChapterStartAd />
            <div className="space-y-0">
              {chapter.images?.map((imageUrl: string, i: number) => (
                <div key={i}>
                  <div 
                    data-page={i + 1}
                    className="w-full"
                  >
                    <MangaPage
                      src={imageUrl}
                      alt={`Page ${i + 1}`}
                      pageNumber={i + 1}
                      priority={i < 2}
                    />
                  </div>
                  {(i + 1) % 5 === 0 && <InlineAd pageNumber={i + 1} />}
                </div>
              ))}
            </div>
            <ChapterEndAd />
          </div>
        )
      
      default: // vertical
        return (
          <div 
            ref={contentRef}
            className="max-w-4xl mx-auto px-4 py-8"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            <ChapterStartAd />
            <div className="space-y-2">
              {chapter.images?.map((imageUrl: string, i: number) => (
                <div key={i}>
                  <div 
                    data-page={i + 1}
                    className="bg-gray-900 rounded-lg overflow-hidden"
                  >
                    <MangaPage
                      src={imageUrl}
                      alt={`Page ${i + 1}`}
                      pageNumber={i + 1}
                      priority={i < 2}
                    />
                  </div>
                  {(i + 1) % 5 === 0 && <InlineAd pageNumber={i + 1} />}
                </div>
              ))}
            </div>
            <ChapterEndAd />

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
        )
    }
  }

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
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm"
              >
                ⚙️ Settings
              </button>
              <button className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700 text-sm">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-16 right-4 z-40 animate-in slide-in-from-top">
          <ReadingModeSelector />
        </div>
      )}

      {/* Reader Content */}
      {renderContent()}

      {/* Navigation Controls (for horizontal/double-page modes) */}
      {(mode === 'horizontal' || mode === 'double-page') && (
        <>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 text-white rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed z-30"
          >
            ←
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 text-white rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed z-30"
          >
            →
          </button>
        </>
      )}

      {/* Reading Progress Auto-save indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-20">
        {loadedCount > 0 && `Preloading ${loadedCount}/3...`}
      </div>
    </div>
  )
}
