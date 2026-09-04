'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  quality?: number
  sizes?: string
  onLoadingComplete?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 75,
  sizes,
  onLoadingComplete
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 text-sm">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Failed to load</p>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => {
            setIsLoading(false)
            onLoadingComplete?.()
          }}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      )}
    </div>
  )
}

// Component untuk manga cover
export function MangaCover({
  src,
  alt,
  priority = false,
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={400}
      priority={priority}
      quality={75}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      className="w-full h-full object-cover"
    />
  )
}

// Component untuk chapter page
export function MangaPage({
  src,
  alt,
  pageNumber,
  priority = false,
}: {
  src: string
  alt: string
  pageNumber: number
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={800}
      height={1200}
      priority={priority}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
      className="w-full h-auto"
    />
  )
}
