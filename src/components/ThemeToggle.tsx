'use client'

import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-14 xs:h-8 xs:w-16 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">Switch theme</span>
      
      {/* Sun icon for light mode */}
      <span className={`inline-block h-5 w-5 xs:h-6 xs:w-6 transform rounded-full bg-white transition-transform ${theme === 'light' ? 'translate-x-1 xs:translate-x-1.5' : 'translate-x-8 xs:translate-x-10'} shadow-lg`}>
        {theme === 'light' ? (
          <svg className="h-full w-full p-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-full w-full p-1 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
      
      {/* Background indicator */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 xs:px-2">
        <span className={`text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
          ☀️
        </span>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          🌙
        </span>
      </span>
    </button>
  )
}
