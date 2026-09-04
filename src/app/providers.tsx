'use client'

import { SessionProvider } from 'next-auth/react'
import { ReadingModeProvider } from '@/contexts/ReadingModeContext'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReadingModeProvider>
        {children}
      </ReadingModeProvider>
    </SessionProvider>
  )
}
