import { AdPosition } from '@prisma/client'

interface AdComponentProps {
  position: AdPosition
  className?: string
}

export function AdComponent({ position, className = '' }: AdComponentProps) {
  // In production, you would fetch ads dynamically
  // For now, we'll show placeholder ads

  const getAdStyle = () => {
    switch (position) {
      case 'HEADER':
        return 'w-full h-16 xs:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white'
      case 'SIDEBAR_LEFT':
      case 'SIDEBAR_RIGHT':
        return 'w-full aspect-[3/4] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-gray-300'
      case 'BEFORE_CONTENT':
        return 'w-full h-24 xs:h-32 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mb-6'
      case 'AFTER_CONTENT':
        return 'w-full h-24 xs:h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mt-6'
      case 'FOOTER':
        return 'w-full h-20 xs:h-24 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-gray-300'
      case 'INLINE':
        return 'w-full h-32 xs:h-40 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white my-6'
      default:
        return 'w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center'
    }
  }

  const getAdText = () => {
    switch (position) {
      case 'HEADER':
        return '📢 Iklan Header - Dapatkan diskon 50%!'
      case 'SIDEBAR_LEFT':
      case 'SIDEBAR_RIGHT':
        return '📱 Iklan Sidebar'
      case 'BEFORE_CONTENT':
        return '🎁 Spesial Offer - Limited Time!'
      case 'AFTER_CONTENT':
        return '📚 Baca lebih banyak!'
      case 'FOOTER':
        return '© 2026 MangaReader - Partner Kami'
      case 'INLINE':
        return '🔥 Hot Deal - Cek Sekarang!'
      default:
        return 'Iklan'
    }
  }

  return (
    <div className={`${getAdStyle()} ${className} transition-all duration-300`}>
      <div className="text-center px-4">
        <div className="font-bold text-lg xs:text-xl mb-1">{getAdText()}</div>
        <div className="text-sm xs:text-base opacity-90">Space untuk iklan Anda</div>
        <div className="text-xs xs:text-sm mt-2 opacity-70">Admin → Ads → Add New</div>
      </div>
    </div>
  )
}
