'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AdPosition } from '@prisma/client'

export default function NewAdPage() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    position: '' as AdPosition | '',
    isActive: true,
  })

  const positionOptions = [
    { value: 'HEADER', label: 'Header', description: 'Tampil di bagian atas halaman' },
    { value: 'BEFORE_CONTENT', label: 'Sebelum Konten', description: 'Sebelum konten utama dimulai' },
    { value: 'AFTER_CONTENT', label: 'Setelah Konten', description: 'Setelah konten utama selesai' },
    { value: 'INLINE', label: 'Inline Chapter', description: 'Disisipkan setiap 5 halaman chapter' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        alert('Iklan berhasil ditambahkan!')
        window.location.href = '/admin/ads'
      } else {
        const data = await res.json()
        alert(`Gagal: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Link href="/admin/ads" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800">
                  Ads
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/ads" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Iklan Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Iklan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="e.g., Google AdSense Header"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posisi <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value as AdPosition})}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">-- Pilih Posisi --</option>
              {positionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} - {opt.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Iklan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={8}
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-4 py-2 font-mono text-sm"
              placeholder="Paste kode HTML/JavaScript dari provider iklan"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktifkan iklan sekarang
            </label>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/ads"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Simpan Iklan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
