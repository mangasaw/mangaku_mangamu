import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation - Mobile responsive */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl sm:text-2xl font-bold text-indigo-400 whitespace-nowrap">
                Admin Panel
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
                <Link href="/admin" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-gray-800 whitespace-nowrap">
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
              <Link href="/admin" className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-gray-800 whitespace-nowrap">
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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats - Mobile responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 xs:p-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2 xs:p-2.5 sm:p-3">
                <svg className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-3 xs:ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">Total Series</dt>
                  <dd className="text-xl xs:text-2xl font-semibold text-gray-900">248</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 xs:p-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-2 xs:p-2.5 sm:p-3">
                <svg className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3 xs:ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">Total Chapters</dt>
                  <dd className="text-xl xs:text-2xl font-semibold text-gray-900">12,458</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 xs:p-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-2 xs:p-2.5 sm:p-3">
                <svg className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3 xs:ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-xl xs:text-2xl font-semibold text-gray-900">8,942</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 xs:p-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-2 xs:p-2.5 sm:p-3">
                <svg className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-3 xs:ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">Today Views</dt>
                  <dd className="text-xl xs:text-2xl font-semibold text-gray-900">45,231</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Latest Series */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 xs:px-5 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base xs:text-lg font-semibold text-gray-900">Latest Series</h3>
            </div>
            <div className="p-4 xs:p-5 sm:p-6">
              <div className="space-y-3 xs:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 xs:space-x-3">
                      <div className="w-10 h-14 xs:w-12 xs:h-16 bg-gray-200 rounded flex-shrink-0"></div>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-gray-900 line-clamp-1">Manga Title {i + 1}</p>
                        <p className="text-xxs xs:text-xs text-gray-500">{i + 1} hours ago</p>
                      </div>
                    </div>
                    <Link href={`/admin/series/${i + 1}`} className="text-indigo-600 hover:text-indigo-700 text-xs xs:text-sm whitespace-nowrap">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Chapters */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 xs:px-5 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base xs:text-lg font-semibold text-gray-900">Latest Chapters</h3>
            </div>
            <div className="p-4 xs:p-5 sm:p-6">
              <div className="space-y-3 xs:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs xs:text-sm font-medium text-gray-900 line-clamp-1">Manga Title {i + 1} - Chapter {100 - i}</p>
                      <p className="text-xxs xs:text-xs text-gray-500">{i * 2} hours ago</p>
                    </div>
                    <Link href={`/admin/chapters/edit/${i + 1}`} className="text-indigo-600 hover:text-indigo-700 text-xs xs:text-sm whitespace-nowrap flex-shrink-0 ml-2">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile responsive */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          <Link href="/admin/series/new" className="bg-indigo-600 text-white rounded-lg p-4 xs:p-5 sm:p-6 hover:bg-indigo-700 transition-colors">
            <div className="flex items-center">
              <svg className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="ml-3 xs:ml-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold">Add New Series</h3>
                <p className="text-xs xs:text-sm text-indigo-200">Upload new manga</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/chapters/new" className="bg-green-600 text-white rounded-lg p-4 xs:p-5 sm:p-6 hover:bg-green-700 transition-colors">
            <div className="flex items-center">
              <svg className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="ml-3 xs:ml-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold">Add New Chapter</h3>
                <p className="text-xs xs:text-sm text-green-200">Upload new chapter</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="bg-gray-700 text-white rounded-lg p-4 xs:p-5 sm:p-6 hover:bg-gray-800 transition-colors sm:col-span-2 md:col-span-1">
            <div className="flex items-center">
              <svg className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="ml-3 xs:ml-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold">Settings</h3>
                <p className="text-xs xs:text-sm text-gray-300">Configure site</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
