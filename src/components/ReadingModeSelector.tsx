'use client'

import { useReadingMode } from '@/contexts/ReadingModeContext'

export function ReadingModeSelector() {
  const { mode, setMode } = useReadingMode()

  const modes = [
    { 
      value: 'vertical' as const, 
      label: 'Vertical', 
      icon: '📜',
      description: 'Scroll down'
    },
    { 
      value: 'horizontal' as const, 
      label: 'Horizontal', 
      icon: '➡️',
      description: 'Swipe left/right'
    },
    { 
      value: 'double-page' as const, 
      label: 'Double Page', 
      icon: '📖',
      description: 'Manga style'
    },
    { 
      value: 'webtoon' as const, 
      label: 'Webtoon', 
      icon: '∞',
      description: 'Infinite scroll'
    },
  ]

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-dark-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Reading Mode
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              mode === m.value
                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
            }`}
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className={`text-xs font-medium ${
              mode === m.value 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {m.label}
            </div>
            <div className="text-xxs text-gray-500 dark:text-gray-400">
              {m.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ReadingModeButton() {
  const { mode } = useReadingMode()
  
  const modeIcons = {
    vertical: '📜',
    horizontal: '➡️',
    'double-page': '📖',
    webtoon: '∞',
  }

  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 dark:bg-dark-700 text-white rounded hover:bg-gray-700 dark:hover:bg-dark-600 text-sm">
      <span>{modeIcons[mode]}</span>
      <span className="hidden sm:inline">Mode</span>
    </button>
  )
}
