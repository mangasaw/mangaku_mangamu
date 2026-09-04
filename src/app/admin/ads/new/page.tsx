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
  
  const [preview, setPreview] = useState(false)

  const positionOptions = [
    { value: 'HEADER', label: 'Header', description: 'Tampil di bagian atas halaman' },
    { value: 'SIDEBAR_LEFT', label: 'Sidebar Kiri', description: 'Sidebar kiri (desktop only)' },
    { value: 'SIDEBAR_RIGHT', label: 'Sidebar Kanan', description: 'Sidebar kanan (desktop only)' },
    { value: 'BEFORE_CONTENT', label: 'Sebelum Konten', description: 'Sebelum konten utama dimulai' },
    { value: 'AFTER_CONTENT', label: 'Setelah Konten', description: 'Setelah konten utama selesai' },
    { value: 'FOOTER', label: 'Footer', description: 'Bagian bawah halaman' },
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
        alert(`Gagal menambahkan iklan: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating ad:', error)
      alert('Terjadi kesalahan')
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/ads" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Iklan
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Iklan Baru</h1>
          <p className="text-gray-600 mt-1">Buat iklan baru dengan penempatan strategis</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Iklan</h2>
            
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
                placeholder="e.g., Google AdSense - Header Banner"
              />
              <p className="text-xs text-gray-500 mt-1">Nama internal untuk identifikasi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posisi Iklan <span className="text-red-500">*</span>
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
                placeholder="Paste kode HTML/JavaScript dari provider iklan (Google AdSense, Media.net, dll)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste kode iklan dari provider seperti Google AdSense, Media.net, atau kode HTML custom
              </p>
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
          </div>

          {/* Preview */}
          {formData.code && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {preview ? 'Sembunyikan' : 'Tampilkan'} Preview
                </button>
              </div>
              
              {preview && (
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-2 text-center">Preview Iklan:</div>
                  <div dangerouslySetInnerHTML={{ __html: formData.code }} />
                </div>
              )}
            </div>
          )}

          {/* Ad Optimization Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips Optimasi Iklan:</h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
              <li>Gunakan <strong>INLINE</strong> untuk CTR tertinggi (disisipkan di chapter)</li>
              <li><strong>BEFORE_CONTENT</strong> dan <strong>AFTER_CONTENT</strong> mendapat engagement baik</li>
              <li>Hindari terlalu banyak iklan di satu posisi (max 1-2 per posisi)</li>
              <li>Monitor CTR secara berkala dan nonaktifkan iklan dengan performa rendah</li>
              <li>Test berbagai posisi untuk menemukan yang paling optimal</li>
            </ul>
          </div>

          {/* Submit Buttons */}
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

        {/* Example Ad Code */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contoh Kode Iklan:</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">Google AdSense:</div>
              <pre className="bg-gray-50 border border-gray-300 rounded p-3 text-xs overflow-x-auto">
{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">HTML Custom Banner:</div>
              <pre className="bg-gray-50 border border-gray-300 rounded p-3 text-xs overflow-x-auto">
{`<a href="https://example.com" target="_blank">
  <img src="https://example.com/banner.jpg" 
       alt="Advertisement" 
       style="width:100%; max-width:728px; height:auto;">
</a>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
