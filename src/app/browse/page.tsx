import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MangaCover } from '@/components/OptimizedImage'
import { LazyLoad } from '@/components/LazyLoad'

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-6 sm:py-8">
        {/* Filters - Mobile responsive */}
        <div className="bg-white rounded-lg shadow-sm p-4 xs:p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base xs:text-lg font-semibold mb-3 sm:mb-4">Filter</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Genre
              </label>
              <select className="w-full border border-gray-300 rounded-lg sm:rounded-md px-3 py-2 text-sm xs:text-base">
                <option>Semua Genre</option>
                <option>Action</option>
                <option>Romance</option>
                <option>Comedy</option>
                <option>Drama</option>
              </select>
            </div>
            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-lg sm:rounded-md px-3 py-2 text-sm xs:text-base">
                <option>Semua Status</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Hiatus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Urutkan
              </label>
              <select className="w-full border border-gray-300 rounded-lg sm:rounded-md px-3 py-2 text-sm xs:text-base">
                <option>Terbaru</option>
                <option>Populer</option>
                <option>A-Z</option>
              </select>
            </div>
            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Cari
              </label>
              <input
                type="text"
                placeholder="Cari manga..."
                className="w-full border border-gray-300 rounded-lg sm:rounded-md px-3 py-2 text-sm xs:text-base"
              />
            </div>
          </div>
        </div>

        {/* Manga Grid - Mobile responsive */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <LazyLoad key={i} threshold={0.1} rootMargin="400px">
              <Link
                href={`/manga/${i + 1}`}
                className="group block"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-1.5 sm:mb-2">
                  <MangaCover
                    src={`https://via.placeholder.com/300x400?text=Cover+${i + 1}`}
                    alt={`Manga Title ${i + 1}`}
                    priority={i < 6}
                  />
                </div>
                <h3 className="text-xs xs:text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                  Manga Title {i + 1}
                </h3>
                <p className="text-xxs xs:text-xs text-gray-500 mt-0.5">Chapter {100 + i}</p>
              </Link>
            </LazyLoad>
          ))}
        </div>

        {/* Pagination - Mobile responsive */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <nav className="flex items-center space-x-1 xs:space-x-2">
            <button className="px-2 py-1.5 xs:px-3 xs:py-2 border border-gray-300 rounded-lg sm:rounded-md text-xs xs:text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-2 py-1.5 xs:px-3 xs:py-2 bg-indigo-600 text-white rounded-lg sm:rounded-md text-xs xs:text-sm">
              1
            </button>
            <button className="px-2 py-1.5 xs:px-3 xs:py-2 border border-gray-300 rounded-lg sm:rounded-md text-xs xs:text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-2 py-1.5 xs:px-3 xs:py-2 border border-gray-300 rounded-lg sm:rounded-md text-xs xs:text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-2 py-1.5 xs:px-3 xs:py-2 border border-gray-300 rounded-lg sm:rounded-md text-xs xs:text-sm hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
