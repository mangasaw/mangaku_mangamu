'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ReadingMode = 'vertical' | 'horizontal' | 'double-page' | 'webtoon'

interface ReadingModeContextType {
  mode: ReadingMode
  setMode: (mode: ReadingMode) => void
  autoNext: boolean
  setAutoNext: (auto: boolean) => void
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined)

export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ReadingMode>('vertical')
  const [autoNext, setAutoNext] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readingMode')
    if (saved) {
      setModeState(saved as ReadingMode)
    }
    
    const savedAutoNext = localStorage.getItem('autoNext')
    if (savedAutoNext !== null) {
      setAutoNext(savedAutoNext === 'true')
    }
  }, [])

  // Save to localStorage when changed
  const setMode = (newMode: ReadingMode) => {
    setModeState(newMode)
    localStorage.setItem('readingMode', newMode)
  }

  const setAutoNextWithSave = (auto: boolean) => {
    setAutoNext(auto)
    localStorage.setItem('autoNext', auto.toString())
  }

  return (
    <ReadingModeContext.Provider value={{ mode, setMode, autoNext, setAutoNext: setAutoNextWithSave }}>
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
