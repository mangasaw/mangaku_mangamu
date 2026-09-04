import { AdPosition } from '@prisma/client'
import { useEffect, useState } from 'react'

interface AdComponentProps {
  position: AdPosition
  className?: string
  chapterPage?: number // For inline ads tracking
}

export function AdComponent({ position, className = '', chapterPage }: AdComponentProps) {
  const [adData, setAdData] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fetch active ad for this position
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/ads/active?position=${position}`)
        const data = await res.json()
        if (data.ad) {
          setAdData(data.ad)
          setIsVisible(true)
          
          // Track ad impression
          trackAdImpression(data.ad.id, position)
        }
      } catch (error) {
        console.error('Error fetching ad:', error)
      }
    }

    fetchAd()
  }, [position])

  const trackAdImpression = (adId: string, position: string) => {
    // Track ad view for analytics
    if (typeof window !== 'undefined') {
      console.log(`Ad impression: ${adId} at ${position}`)
      // TODO: Send to analytics service
    }
  }

  const handleAdClick = () => {
    if (adData) {
      console.log(`Ad clicked: ${adData.id}`)
      // TODO: Track ad click
    }
  }

  if (!isVisible || !adData) return null

  const getAdStyle = () => {
    switch (position) {
      case 'HEADER':
        return 'w-full h-16 xs:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-lg flex items-center justify-center text-white'
      case 'SIDEBAR_LEFT':
      case 'SIDEBAR_RIGHT':
        return 'w-full aspect-[3/4] bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-lg flex items-center justify-center text-gray-300'
      case 'BEFORE_CONTENT':
        return 'w-full h-24 xs:h-32 bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-lg flex items-center justify-center text-white mb-6'
      case 'AFTER_CONTENT':
        return 'w-full h-24 xs:h-32 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-lg flex items-center justify-center text-white mt-6'
      case 'FOOTER':
        return 'w-full h-20 xs:h-24 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-gray-300'
      case 'INLINE':
        return 'w-full h-32 xs:h-40 bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 rounded-lg flex items-center justify-center text-white my-6'
      default:
        return 'w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center'
    }
  }

  // If ad has custom HTML code, render it
  if (adData.code && adData.code.trim()) {
    return (
      <div 
        className={`ad-container ${className}`}
        onClick={handleAdClick}
        dangerouslySetInnerHTML={{ __html: adData.code }}
      />
    )
  }

  // Fallback placeholder ad
  return (
    <div className={`${getAdStyle()} ${className} transition-all duration-300`} onClick={handleAdClick}>
      <div className="text-center px-4">
        <div className="font-bold text-lg xs:text-xl mb-1">{adData.name || 'Advertisement'}</div>
        <div className="text-sm xs:text-base opacity-90">Sponsored Content</div>
        {chapterPage && (
          <div className="text-xs mt-2 opacity-70">Page {chapterPage}</div>
        )}
      </div>
    </div>
  )
}

// Strategically placed ads
export function InlineAd({ pageNumber }: { pageNumber: number }) {
  // Show ad every 5 pages
  if (pageNumber % 5 !== 0) return null
  
  return <AdComponent position="INLINE" chapterPage={pageNumber} />
}

export function ChapterEndAd() {
  return (
    <div className="my-8">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        - Advertisement -
      </div>
      <AdComponent position="AFTER_CONTENT" />
    </div>
  )
}

export function ChapterStartAd() {
  return (
    <div className="mb-8">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        - Advertisement -
      </div>
      <AdComponent position="BEFORE_CONTENT" />
    </div>
  )
}
