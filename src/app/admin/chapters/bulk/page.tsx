'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Series {
  id: string
  title: string
}

interface ChapterData {
  chapterNumber: string
  title: string
  images: string[]
}

export default function BulkUploadPage() {
  const [series, setSeries] = useState<Series[]>([])
  const [selectedSeries, setSelectedSeries] = useState('')
  const [chapters, setChapters] = useState<ChapterData[]>([
    { chapterNumber: '', title: '', images: [] }
  ])
  const [bulkImagesText, setBulkImagesText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    fetchSeries()
  }, [])

  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/series')
      const data = await res.json()
      setSeries(data.series || [])
    } catch (error) {
      console.error('Error fetching series:', error)
    }
  }

  const addChapter = () => {
    setChapters([...chapters, { chapterNumber: '', title: '', images: [] }])
  }

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index))
  }

  const updateChapter = (index: number, field: keyof ChapterData, value: any) => {
    const updated = [...chapters]
    updated[index] = { ...updated[index], [field]: value }
    setChapters(updated)
  }

  const addImageToChapter = (chapterIndex: number, imageUrl: string) => {
    if (!imageUrl.trim()) return
    const updated = [...chapters]
    updated[chapterIndex].images = [...updated[chapterIndex].images, imageUrl.trim()]
    setChapters(updated)
  }

  const removeImageFromChapter = (chapterIndex: number, imageIndex: number) => {
    const updated = [...chapters]
    updated[chapterIndex].images = updated[chapterIndex].images.filter((_, i) => i !== imageIndex)
    setChapters(updated)
  }

  const parseBulkImages = () => {
    if (!bulkImagesText.trim()) {
      alert('Paste URLs terlebih dahulu!')
      return
    }

    const lines = bulkImagesText.split('\n').filter(line => line.trim())
    
    // Parse format: chapter_number|image_url or just image_url
    const chapterMap = new Map<string, string[]>()
    
    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim())
      
      if (parts.length === 2) {
        // Format: chapter_number|image_url
        const [chapterNum, url] = parts
        if (!chapterMap.has(chapterNum)) {
          chapterMap.set(chapterNum, [])
        }
        chapterMap.get(chapterNum)!.push(url)
      } else if (parts.length === 1) {
        // Just URL, add to first chapter if exists
        const firstChapter = chapters[0]?.chapterNumber || '1'
        if (!chapterMap.has(firstChapter)) {
          chapterMap.set(firstChapter, [])
        }
        chapterMap.get(firstChapter)!.push(parts[0])
      }
    })

    // Create or update chapters
    const newChapters: ChapterData[] = []
    chapterMap.forEach((images, chapterNum) => {
      newChapters.push({
        chapterNumber: chapterNum,
        title: '',
        images
      })
    })

    if (newChapters.length > 0) {
      setChapters(newChapters)
      setBulkImagesText('')
      alert(`${newChapters.length} chapter(s) berhasil di-parse dengan total ${lines.length} gambar!`)
    }
  }

  const handleBulkUpload = async () => {
    if (!selectedSeries) {
      alert('Pilih series terlebih dahulu!')
      return
    }

    const validChapters = chapters.filter(ch => ch.chapterNumber && ch.images.length > 0)
    
    if (validChapters.length === 0) {
      alert('Tidak ada chapter valid untuk diupload!')
      return
    }

    if (!confirm(`Upload ${validChapters.length} chapter(s) ke series ini?`)) {
      return
    }

    setUploading(true)
    setProgress({ current: 0, total: validChapters.length })

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < validChapters.length; i++) {
      const chapter = validChapters[i]
      
      try {
        const res = await fetch('/api/admin/chapters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seriesId: selectedSeries,
            chapterNumber: parseFloat(chapter.chapterNumber),
            title: chapter.title || null,
            images: chapter.images,
          })
        })

        if (res.ok) {
          successCount++
        } else {
          failCount++
          console.error(`Failed to upload chapter ${chapter.chapterNumber}`)
        }
      } catch (error) {
        failCount++
        console.error(`Error uploading chapter ${chapter.chapterNumber}:`, error)
      }

      setProgress({ current: i + 1, total: validChapters.length })
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setUploading(false)
    alert(`Upload selesai!\n✅ Berhasil: ${successCount}\n❌ Gagal: ${failCount}`)
    
    if (successCount > 0) {
      // Reset form
      setChapters([{ chapterNumber: '', title: '', images: [] }])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-indigo-400">
                Admin Panel
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Dashboard
                </Link>
                <Link href="/admin/series" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Manga Series
                </Link>
                <Link href="/admin/chapters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Chapters
                </Link>
                <Link href="/admin/chapters/bulk" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800">
                  Bulk Upload
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white">
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/chapters" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Chapters
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Chapters</h1>
          <p className="text-gray-600 mt-1">Upload beberapa chapter sekaligus dengan cepat</p>
        </div>

        {/* Series Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Series</h2>
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">-- Pilih Series --</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* Bulk Image Parser */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Bulk Parser</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">📝 Format:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Option 1:</strong> Satu URL per baris (akan masuk ke chapter pertama)</p>
              <pre className="bg-white p-2 rounded mt-1 text-xs">
https://example.com/page1.jpg
https://example.com/page2.jpg
              </pre>
              
              <p className="mt-2"><strong>Option 2:</strong> Format chapter_number|url</p>
              <pre className="bg-white p-2 rounded mt-1 text-xs">
1|https://example.com/ch1-page1.jpg
1|https://example.com/ch1-page2.jpg
2|https://example.com/ch2-page1.jpg
2|https://example.com/ch2-page2.jpg
              </pre>
            </div>
          </div>

          <textarea
            rows={8}
            value={bulkImagesText}
            onChange={(e) => setBulkImagesText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 font-mono text-sm mb-3"
            placeholder="Paste URLs di sini..."
          />
          
          <button
            onClick={parseBulkImages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Parse URLs
          </button>
        </div>

        {/* Chapters List */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Chapters ({chapters.length})
            </h2>
            <button
              onClick={addChapter}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              + Tambah Chapter
            </button>
          </div>

          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-md font-semibold text-gray-900">
                  Chapter #{chapterIndex + 1}
                </h3>
                {chapters.length > 1 && (
                  <button
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={chapter.chapterNumber}
                    onChange={(e) => updateChapter(chapterIndex, 'chapterNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    placeholder="e.g., 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    placeholder="e.g., The Beginning"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images ({chapter.images.length} pages)
                </label>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    id={`image-input-${chapterIndex}`}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                    placeholder="https://example.com/page.jpg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        addImageToChapter(chapterIndex, input.value)
                        input.value = ''
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(`image-input-${chapterIndex}`) as HTMLInputElement
                      addImageToChapter(chapterIndex, input.value)
                      input.value = ''
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>

                {chapter.images.length > 0 && (
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {chapter.images.map((url, imgIndex) => (
                      <div key={imgIndex} className="flex items-center gap-2 mb-2 text-sm">
                        <span className="font-semibold text-gray-600 w-12">P{imgIndex + 1}</span>
                        <span className="flex-1 text-gray-700 truncate">{url}</span>
                        <button
                          onClick={() => removeImageFromChapter(chapterIndex, imgIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Uploading...</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Progress: {progress.current} / {progress.total} chapters
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/chapters"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            onClick={handleBulkUpload}
            disabled={uploading || !selectedSeries || chapters.filter(ch => ch.chapterNumber && ch.images.length > 0).length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${chapters.filter(ch => ch.chapterNumber && ch.images.length > 0).length} Chapter(s)`}
          </button>
        </div>
      </div>
    </div>
  )
}
