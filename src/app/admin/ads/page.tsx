'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AdPosition } from '@prisma/client'

interface Ad {
  id: string
  name: string
  code: string
  position: AdPosition
  isActive: boolean
  createdAt: string
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(data.ads || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus iklan ini?')) return

    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        alert('Iklan berhasil dihapus!')
        fetchAds()
      } else {
        alert('Gagal menghapus iklan')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Terjadi kesalahan')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      if (res.ok) {
        fetchAds()
      }
    } catch (error) {
      console.error('Error toggling ad status:', error)
    }
  }

  const filteredAds = ads.filter(ad => {
    if (filter === 'active' && !ad.isActive) return false
    if (filter === 'inactive' && ad.isActive) return false
    return true
  })

  const positionLabels: Record<AdPosition, string> = {
    HEADER: 'Header',
    SIDEBAR_LEFT: 'Sidebar Kiri',
    SIDEBAR_RIGHT: 'Sidebar Kanan',
    BEFORE_CONTENT: 'Sebelum Konten',
    AFTER_CONTENT: 'Setelah Konten',
    FOOTER: 'Footer',
    INLINE: 'Inline (Chapter)',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
                <Link href="/admin/ads" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800">
                  Ads
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Iklan</h1>
            <p className="text-gray-600 mt-1">Atur penempatan iklan di website</p>
          </div>
          <Link
            href="/admin/ads/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            + Tambah Iklan
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Iklan</div>
            <div className="text-2xl font-bold text-gray-900">{ads.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Aktif</div>
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(a => a.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Tidak Aktif</div>
            <div className="text-2xl font-bold text-gray-400">
              {ads.filter(a => !a.isActive).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Iklan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada iklan. Tambah iklan baru untuk memulai.
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr key={ad.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{ad.name}</div>
                      <div className="text-xs text-gray-500">ID: {ad.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {positionLabels[ad.position]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(ad.id, ad.isActive)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          ad.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ad.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
