'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NewSeriesPage() {
  const [formData, setFormData] = useState({
    title: '',
    titleAlt: '',
    author: '',
    artist: '',
    description: '',
    coverImage: '',
    status: 'ongoing',
    licenseStatus: 'original',
    allowOfflineDownload: true,
    genres: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call
    console.log('Form data:', formData)
    alert('Series akan ditambahkan!')
  }

  const availableGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
    'Sports', 'Supernatural', 'Thriller'
  ]

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
                <Link href="/admin/series" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800">
                  Manga Series
                </Link>
                <Link href="/admin/chapters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
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
          <Link href="/admin/series" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Series List
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Manga Series</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="e.g., One Piece"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Title
              </label>
              <input
                type="text"
                value={formData.titleAlt}
                onChange={(e) => setFormData({...formData, titleAlt: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="e.g., ワンピース"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artist <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.artist}
                  onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Describe the manga story..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="https://example.com/cover.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload cover to CDN (Cloudinary, ImgBB) and paste URL here
              </p>
            </div>
          </div>

          {/* Status & License */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & License</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="hiatus">Hiatus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Status
                </label>
                <select
                  value={formData.licenseStatus}
                  onChange={(e) => setFormData({...formData, licenseStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="original">Original</option>
                  <option value="partnership">Partnership</option>
                  <option value="licensed">Licensed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowOffline"
                checked={formData.allowOfflineDownload}
                onChange={(e) => setFormData({...formData, allowOfflineDownload: e.target.checked})}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="allowOffline" className="ml-2 text-sm text-gray-700">
                Allow Offline Download
              </label>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Genres</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableGenres.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(genre)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, genres: [...formData.genres, genre]})
                      } else {
                        setFormData({...formData, genres: formData.genres.filter(g => g !== genre)})
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/series"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Series
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
