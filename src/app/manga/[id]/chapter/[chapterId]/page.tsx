'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ChapterReaderPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20

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
                <h1 className="font-semibold">Manga Title {params.id}</h1>
                <p className="text-sm text-gray-400">Chapter {params.chapterId}</p>
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
        <div className="space-y-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div 
              key={i}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="aspect-[2/3] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-2xl font-bold">Page {i + 1}</p>
                  <p className="text-sm mt-2">Chapter {params.chapterId} - Manga {params.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between bg-gray-900 rounded-lg p-4">
          <Link
            href={`/manga/${params.id}/chapter/${parseInt(params.chapterId) - 1}`}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Chapter Sebelumnya
          </Link>
          
          <Link
            href={`/manga/${params.id}`}
            className="px-6 py-2 border border-gray-700 text-white rounded hover:bg-gray-800"
          >
            Daftar Chapter
          </Link>
          
          <Link
            href={`/manga/${params.id}/chapter/${parseInt(params.chapterId) + 1}`}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Chapter Selanjutnya
          </Link>
        </div>
      </div>

      {/* Reading Progress Auto-save indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
        Progress tersimpan otomatis
      </div>
    </div>
  )
}
