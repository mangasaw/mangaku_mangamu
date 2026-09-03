import Link from 'next/link'

export default function HomePage() {
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Baca Manga Favorit Anda
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Platform baca manga online dengan fitur offline reading. Nikmati ribuan judul manga kapan saja, dimana saja.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Mulai Baca
            </Link>
          </div>
        </div>

        {/* Featured Manga Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manga Populer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Link
                key={item}
                href={`/manga/${item}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Cover {item}
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                  Manga Title {item}
                </h3>
                <p className="text-xs text-gray-500">Chapter 100</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Updates Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Terbaru</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-gray-200 last:border-b-0">
                <Link
                  href={`/manga/${item}`}
                  className="block hover:bg-gray-50 px-6 py-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        Manga Title {item}
                      </h3>
                      <p className="text-sm text-gray-500">Chapter {100 - item}</p>
                    </div>
                    <div className="text-sm text-gray-500">
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
