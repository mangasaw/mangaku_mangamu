'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isLogin) {
      // Login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password salah')
        setLoading(false)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } else {
      // Register - implement nanti kalau perlu
      setError('Register belum tersedia. Hubungi admin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-sm sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-2xl xs:text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">MangaReader</span>
        </Link>
        <h2 className="mt-4 xs:mt-5 sm:mt-6 text-center text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
        </h2>
      </div>

      <div className="mt-6 xs:mt-7 sm:mt-8 mx-auto w-full max-w-sm sm:max-w-md">
        <div className="bg-white dark:bg-dark-800 py-6 xs:py-7 sm:py-8 px-4 xs:px-5 sm:px-6 shadow rounded-lg border border-gray-200 dark:border-dark-700">
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 xs:py-2.5 text-sm xs:text-base border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 rounded-lg xs:rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 xs:py-2.5 text-sm xs:text-base border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 rounded-lg xs:rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-dark-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    Lupa password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 xs:py-3 px-4 border border-transparent rounded-lg xs:rounded-md shadow-sm text-sm xs:text-base font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 active:scale-[0.98] transition-transform"
              >
                {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Atau</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                {isLogin 
                  ? 'Belum punya akun? Daftar sekarang' 
                  : 'Sudah punya akun? Masuk'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
