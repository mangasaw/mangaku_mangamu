import Link from 'next/link'

export default function BrowsePage() {
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
              <Link href="/browse" className="text-indigo-600 font-medium">
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Semua Genre</option>
                <option>Action</option>
                <option>Romance</option>
                <option>Comedy</option>
                <option>Drama</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Semua Status</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Hiatus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Terbaru</option>
                <option>Populer</option>
                <option>A-Z</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari
              </label>
              <input
                type="text"
                placeholder="Cari manga..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Link
              key={i}
              href={`/manga/${i + 1}`}
              className="group"
            >
              <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Cover {i + 1}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                Manga Title {i + 1}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Chapter {100 + i}</p>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
