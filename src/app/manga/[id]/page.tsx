import Link from 'next/link'

export default function MangaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                MangaReader
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/browse" className="text-gray-700 hover:text-indigo-600">
                Browse
              </Link>
              <Link href="/library" className="text-gray-700 hover:text-indigo-600">
                Library
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Manga Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Cover Image</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manga Title {params.id}
              </h1>
              <p className="text-sm text-gray-600 mb-4">Alternative Title</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  Action
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  Adventure
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Ongoing
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-600">Author:</span>
                  <span className="ml-2 font-medium">John Doe</span>
                </div>
                <div>
                  <span className="text-gray-600">Artist:</span>
                  <span className="ml-2 font-medium">Jane Smith</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium">Ongoing</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Chapters:</span>
                  <span className="ml-2 font-medium">150</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <div className="flex gap-4">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Baca Sekarang
                </button>
                <button className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">
                  Tambah ke Library
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Daftar Chapter</h2>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Terbaru</option>
              <option>Terlama</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200">
            {Array.from({ length: 20 }).map((_, i) => (
              <Link
                key={i}
                href={`/manga/${params.id}/chapter/${20 - i}`}
                className="block py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Chapter {20 - i}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {i === 0 ? 'Baru' : `${i} hari lalu`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Download chapter')
                      }}
                    >
                      Download
                    </button>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
