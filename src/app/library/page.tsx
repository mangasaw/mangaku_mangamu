import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-dark-700">
          <div className="border-b border-gray-200 dark:border-dark-700">
            <nav className="flex -mb-px">
              <button className="px-6 py-4 border-b-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium">
                Reading
              </button>
              <button className="px-6 py-4 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Bookmarked
              </button>
              <button className="px-6 py-4 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Downloaded
              </button>
            </nav>
          </div>
        </div>

        {/* Reading List */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sedang Dibaca</h2>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
                <div className="w-16 h-20 bg-gray-200 dark:bg-dark-600 rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <Link href={`/manga/${i + 1}`} className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Manga Title {i + 1}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Terakhir baca: Chapter {50 + i}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(i + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  href={`/manga/${i + 1}/chapter/${50 + i}`}
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 text-sm whitespace-nowrap"
                >
                  Lanjut Baca
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Downloaded Chapters */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapter Terunduh</h2>
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              Hapus Semua
            </button>
          </div>
          
          {/* Storage Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Penyimpanan Terpakai</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">450 MB / 2 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" style={{ width: '22.5%' }}></div>
            </div>
          </div>

          {/* Downloaded Items */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Manga Title {i + 1} - Chapter {100 - i}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    45 MB • 20 pages • Diunduh 2 hari lalu
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                    Tersedia
                  </span>
                  <button className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
