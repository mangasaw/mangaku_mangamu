'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ReadingMode = 'vertical' | 'horizontal' | 'webtoon'

interface ReadingModeContextType {
  mode: ReadingMode
  setMode: (mode: ReadingMode) => void
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined)

export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ReadingMode>('vertical')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readingMode')
    if (saved) {
      setModeState(saved as ReadingMode)
    }
  }, [])

  // Save to localStorage when changed
  const setMode = (newMode: ReadingMode) => {
    setModeState(newMode)
    localStorage.setItem('readingMode', newMode)
  }

  return (
    <ReadingModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ReadingModeContext.Provider>
  )
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext)
  if (!context) {
    throw new Error('useReadingMode must be used within ReadingModeProvider')
  }
  return context
}
