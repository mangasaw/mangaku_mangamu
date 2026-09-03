'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NewChapterPage() {
  const [formData, setFormData] = useState({
    seriesId: '',
    chapterNumber: '',
    title: '',
    images: [] as string[],
  })
  
  const [imageUrl, setImageUrl] = useState('')

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      })
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call
    console.log('Chapter data:', formData)
    alert('Chapter akan ditambahkan!')
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
                <Link href="/admin/chapters" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800">
                  Chapters
                </Link>
                <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Users
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/chapters" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Chapters List
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Chapter</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Chapter Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Series <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.seriesId}
                onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="">-- Select Series --</option>
                <option value="1">One Piece</option>
                <option value="2">Naruto</option>
                <option value="3">Bleach</option>
                <option value="4">Attack on Titan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData({...formData, chapterNumber: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="e.g., 100 or 100.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="e.g., The Final Battle"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Chapter Images ({formData.images.length} pages)
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">📝 Cara Upload Images:</h3>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Upload gambar chapter ke CDN (ImgBB, Cloudinary, atau Imgur)</li>
                <li>Copy URL gambar yang sudah diupload</li>
                <li>Paste URL di bawah ini dan klik "Add Image"</li>
                <li>Ulangi untuk setiap halaman chapter (urutan penting!)</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                placeholder="https://example.com/page-1.jpg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImage()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Image
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                      <span className="font-semibold text-gray-700 text-sm w-16">
                        Page {index + 1}
                      </span>
                      <div className="flex-1 text-sm text-gray-600 truncate">
                        {url}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.images.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500">
                No images added yet. Add image URLs above.
              </div>
            )}
          </div>

          {/* Bulk Upload Helper */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Bulk Upload (Advanced)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Paste multiple URLs (one per line) to add many pages at once:
            </p>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="https://example.com/page-1.jpg&#10;https://example.com/page-2.jpg&#10;https://example.com/page-3.jpg"
              onBlur={(e) => {
                const urls = e.target.value.split('\n').filter(u => u.trim())
                if (urls.length > 0) {
                  setFormData({
                    ...formData,
                    images: [...formData.images, ...urls]
                  })
                  e.target.value = ''
                }
              }}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/chapters"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={formData.images.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Publish Chapter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
