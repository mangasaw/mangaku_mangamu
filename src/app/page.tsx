import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Navigation with responsive hamburger menu */}
      <Navbar />

       {/* Hero Section - Mobile responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 px-2">
            Baca Manga Favorit Anda
          </h1>
          <p className="mt-2 sm:mt-3 max-w-sm sm:max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 px-3">
            Platform baca manga online dengan fitur offline reading. Nikmati ribuan judul manga kapan saja, dimana saja.
          </p>
          <div className="mt-4 sm:mt-5 max-w-sm sm:max-w-md mx-auto">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Mulai Baca
            </Link>
          </div>
        </div>

        {/* Featured Manga Section - Mobile responsive */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 px-2">Manga Populer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Link
                key={item}
                href={`/manga/${item}`}
                className="group block"
              >
                <div className="aspect-[3/4] bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                    Cover {item}
                  </div>
                </div>
                <h3 className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  Manga Title {item}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Chapter 100</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Updates Section - Mobile responsive */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 px-2">Update Terbaru</h2>
          <div className="bg-white dark:bg-dark-800 shadow overflow-hidden rounded-lg border border-gray-200 dark:border-dark-700">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-gray-200 dark:border-dark-700 last:border-b-0">
                <Link
                  href={`/manga/${item}`}
                  className="block hover:bg-gray-50 dark:hover:bg-dark-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    <div className="w-10 h-14 sm:w-12 sm:h-16 bg-gray-200 dark:bg-dark-700 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        Manga Title {item}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Chapter {100 - item}</p>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      2 jam lalu
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
