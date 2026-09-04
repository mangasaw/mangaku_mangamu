'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
  onVisible?: () => void
}

export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '200px',
  placeholder,
  onVisible
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            onVisible?.()
            observer.disconnect()
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, isVisible, onVisible])

  return (
    <div ref={elementRef}>
      {isVisible ? children : (placeholder || <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />)}
    </div>
  )
}

// Hook untuk preload gambar
export function useImagePreloader(urls: string[], priority: number = 3) {
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    if (urls.length === 0) return

    const preloadUrls = urls.slice(0, priority)
    let loaded = 0

    preloadUrls.forEach((url) => {
      const img = new window.Image()
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
      }
      img.onerror = () => {
        loaded++
        setLoadedCount(loaded)
      }
      img.src = url
    })
  }, [urls, priority])

  return { loadedCount, total: Math.min(urls.length, priority) }
}
