'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type TabType = 'popup' | 'ads'

interface Popup {
  id: string
  title?: string
  mediaUrl?: string
  mediaType: 'IMAGE' | 'GIF' | 'VIDEO'
  linkUrl?: string
  isActive: boolean
  showInterval?: number
  displayDuration: number
  autoClose: boolean
  createdAt: string
  updatedAt: string
}

interface Ad {
  id: string
  name: string
  code: string
  position: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function MoneyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('popup')
  const [popups, setPopups] = useState<Popup[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showPopupForm, setShowPopupForm] = useState(false)
  const [showAdForm, setShowAdForm] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [uploading, setUploading] = useState(false)

  // Form states for Popup
  const [popupForm, setPopupForm] = useState({
    title: '',
    mediaUrl: '',
    mediaType: 'IMAGE' as 'IMAGE' | 'GIF' | 'VIDEO',
    linkUrl: '',
    isActive: false,
    showInterval: '',
    displayDuration: '5',
    autoClose: true,
  })

  // Form states for Ad
  const [adForm, setAdForm] = useState({
    name: '',
    code: '',
    position: 'HEADER',
    isActive: true,
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'popup') {
        const res = await fetch('/api/popup')
        const data = await res.json()
        setPopups(data.popups || [])
      } else {
        const res = await fetch('/api/ads')
        const data = await res.json()
        setAds(data.ads || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const handleCreatePopup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...popupForm,
          showInterval: popupForm.showInterval ? parseInt(popupForm.showInterval) : null,
          displayDuration: parseInt(popupForm.displayDuration),
        }),
      })
      
      if (res.ok) {
        setShowPopupForm(false)
        resetPopupForm()
        fetchData()
      }
    } catch (error) {
      console.error('Error creating popup:', error)
    }
  }

  const handleUpdatePopup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPopup) return

    try {
      const res = await fetch(`/api/popup/${editingPopup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...popupForm,
          showInterval: popupForm.showInterval ? parseInt(popupForm.showInterval) : null,
          displayDuration: parseInt(popupForm.displayDuration),
        }),
      })
      
      if (res.ok) {
        setEditingPopup(null)
        resetPopupForm()
        fetchData()
      }
    } catch (error) {
      console.error('Error updating popup:', error)
    }
  }

  const handleDeletePopup = async (id: string) => {
    if (!confirm('Yakin ingin menghapus popup ini?')) return

    try {
      const res = await fetch(`/api/popup/${id}`, { method: 'DELETE' })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Error deleting popup:', error)
    }
  }

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adForm),
      })
      
      if (res.ok) {
        setShowAdForm(false)
        resetAdForm()
        fetchData()
      }
    } catch (error) {
      console.error('Error creating ad:', error)
    }
  }

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAd) return

    try {
      const res = await fetch(`/api/ads/${editingAd.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adForm),
      })
      
      if (res.ok) {
        setEditingAd(null)
        resetAdForm()
        fetchData()
      }
    } catch (error) {
      console.error('Error updating ad:', error)
    }
  }

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Yakin ingin menghapus iklan ini?')) return

    try {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Error deleting ad:', error)
    }
  }

  const startEditPopup = (popup: Popup) => {
    setEditingPopup(popup)
    setPopupForm({
      title: popup.title || '',
      mediaUrl: popup.mediaUrl || '',
      mediaType: popup.mediaType,
      linkUrl: popup.linkUrl || '',
      isActive: popup.isActive,
      showInterval: popup.showInterval?.toString() || '',
      displayDuration: popup.displayDuration.toString(),
      autoClose: popup.autoClose,
    })
  }

  const startEditAd = (ad: Ad) => {
    setEditingAd(ad)
    setAdForm({
      name: ad.name,
      code: ad.code,
      position: ad.position,
      isActive: ad.isActive,
    })
  }

  const resetPopupForm = () => {
    setPopupForm({
      title: '',
      mediaUrl: '',
      mediaType: 'IMAGE',
      linkUrl: '',
      isActive: false,
      showInterval: '',
      displayDuration: '5',
      autoClose: true,
    })
  }

  const resetAdForm = () => {
    setAdForm({
      name: '',
      code: '',
      position: 'HEADER',
      isActive: true,
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok && data.url) {
        setPopupForm({ ...popupForm, mediaUrl: data.url })
        alert('File berhasil diupload!')
      } else {
        alert('Gagal upload file: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Gagal upload file')
    }
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl sm:text-2xl font-bold text-indigo-400 whitespace-nowrap">
                Admin Panel
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
                <Link href="/admin" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                  Dashboard
                </Link>
                <Link href="/admin/series" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                  Manga Series
                </Link>
                <Link href="/admin/chapters" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                  Chapters
                </Link>
                <Link href="/admin/users" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                  Users
                </Link>
                <Link href="/admin/money" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-gray-800 whitespace-nowrap">
                  Money
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white text-xs sm:text-sm whitespace-nowrap">
                View Site
              </Link>
              <button className="text-gray-300 hover:text-white text-xs sm:text-sm whitespace-nowrap">
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Admin Menu */}
          <div className="sm:hidden mt-2 pb-2">
            <div className="flex flex-wrap gap-1">
              <Link href="/admin" className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 whitespace-nowrap">
                Dashboard
              </Link>
              <Link href="/admin/series" className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 whitespace-nowrap">
                Manga Series
              </Link>
              <Link href="/admin/chapters" className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 whitespace-nowrap">
                Chapters
              </Link>
              <Link href="/admin/users" className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 whitespace-nowrap">
                Users
              </Link>
              <Link href="/admin/money" className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-gray-800 whitespace-nowrap">
                Money
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Money Management</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('popup')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'popup'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pop-up Settings
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'ads'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ads Settings
            </button>
          </div>
        </div>

        {/* Pop-up Tab */}
        {activeTab === 'popup' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Manage Pop-ups</h2>
              <button
                onClick={() => {
                  setShowPopupForm(!showPopupForm)
                  setEditingPopup(null)
                  resetPopupForm()
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
              >
                {showPopupForm ? 'Cancel' : 'Add New Pop-up'}
              </button>
            </div>

            {/* Popup Form */}
            {(showPopupForm || editingPopup) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingPopup ? 'Edit Pop-up' : 'Create New Pop-up'}
                </h3>
                <form onSubmit={editingPopup ? handleUpdatePopup : handleCreatePopup}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={popupForm.title}
                        onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter popup title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Media Type
                      </label>
                      <select
                        value={popupForm.mediaType}
                        onChange={(e) => setPopupForm({ ...popupForm, mediaType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="IMAGE">Image</option>
                        <option value="GIF">GIF</option>
                        <option value="VIDEO">Video</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Media URL *
                      </label>
                      <div className="space-y-3">
                        {/* File Upload */}
                        <div>
                          <label className="block">
                            <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                              <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">
                                  {uploading ? 'Uploading...' : 'Click to upload file'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG, WEBP, GIF, MP4, WEBM
                                </p>
                              </div>
                              <input
                                type="file"
                                onChange={handleFileUpload}
                                accept="image/*,video/mp4,video/webm"
                                className="hidden"
                                disabled={uploading}
                              />
                            </div>
                          </label>
                        </div>

                        {/* Or Manual URL */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">atau masukkan URL</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={popupForm.mediaUrl}
                          onChange={(e) => setPopupForm({ ...popupForm, mediaUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="https://example.com/image.jpg atau /uploads/popups/file.webp"
                          required
                        />
                        
                        {popupForm.mediaUrl && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                            ✓ Media URL: {popupForm.mediaUrl}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={popupForm.linkUrl}
                        onChange={(e) => setPopupForm({ ...popupForm, linkUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Show Interval (seconds, kosongkan untuk setiap kali)
                      </label>
                      <input
                        type="number"
                        value={popupForm.showInterval}
                        onChange={(e) => setPopupForm({ ...popupForm, showInterval: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="3600"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Duration (seconds, 0 untuk manual only)
                      </label>
                      <input
                        type="number"
                        value={popupForm.displayDuration}
                        onChange={(e) => setPopupForm({ ...popupForm, displayDuration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="5"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={popupForm.autoClose}
                          onChange={(e) => setPopupForm({ ...popupForm, autoClose: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Auto Close</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={popupForm.isActive}
                          onChange={(e) => setPopupForm({ ...popupForm, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      {editingPopup ? 'Update' : 'Create'}
                    </button>
                    {editingPopup && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPopup(null)
                          resetPopupForm()
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Popup List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : popups.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Belum ada pop-up</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auto Close</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {popups.map((popup) => (
                        <tr key={popup.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {popup.title || '(No title)'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{popup.mediaType}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              popup.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {popup.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {popup.autoClose ? 'Yes' : 'No'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {popup.displayDuration}s
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => startEditPopup(popup)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePopup(popup.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Manage Ads</h2>
              <button
                onClick={() => {
                  setShowAdForm(!showAdForm)
                  setEditingAd(null)
                  resetAdForm()
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
              >
                {showAdForm ? 'Cancel' : 'Add New Ad'}
              </button>
            </div>

            {/* Ad Form */}
            {(showAdForm || editingAd) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAd ? 'Edit Ad' : 'Create New Ad'}
                </h3>
                <form onSubmit={editingAd ? handleUpdateAd : handleCreateAd}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Name *
                      </label>
                      <input
                        type="text"
                        value={adForm.name}
                        onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter ad name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <select
                        value={adForm.position}
                        onChange={(e) => setAdForm({ ...adForm, position: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="HEADER">Header</option>
                        <option value="SIDEBAR_LEFT">Sidebar Left</option>
                        <option value="SIDEBAR_RIGHT">Sidebar Right</option>
                        <option value="BEFORE_CONTENT">Before Content</option>
                        <option value="AFTER_CONTENT">After Content</option>
                        <option value="FOOTER">Footer</option>
                        <option value="INLINE">Inline</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Code (HTML/Script) *
                      </label>
                      <textarea
                        value={adForm.code}
                        onChange={(e) => setAdForm({ ...adForm, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={6}
                        placeholder="<script>...</script> atau <div>...</div>"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={adForm.isActive}
                          onChange={(e) => setAdForm({ ...adForm, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      {editingAd ? 'Update' : 'Create'}
                    </button>
                    {editingAd && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAd(null)
                          resetAdForm()
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Ad List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : ads.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Belum ada iklan</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ads.map((ad) => (
                        <tr key={ad.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{ad.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{ad.position}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ad.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => startEditAd(ad)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
