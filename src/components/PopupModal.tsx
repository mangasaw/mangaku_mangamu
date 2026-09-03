'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface PopupData {
  id: string
  title?: string
  imageUrl?: string
  linkUrl?: string
  showInterval?: number
  displayDuration: number
}

export function PopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkAndShowPopup = async () => {
      try {
        const response = await fetch('/api/popup/active')
        const data = await response.json()

        if (data.popup) {
          const { showInterval, id } = data.popup
          const lastShownKey = `popup_last_shown_${id}`
          const lastShown = localStorage.getItem(lastShownKey)

          // Cek apakah perlu tampilkan popup
          if (showInterval) {
            // Ada interval, cek waktu terakhir ditampilkan
            if (lastShown) {
              const timeSinceLastShown = Date.now() - parseInt(lastShown)
              if (timeSinceLastShown < showInterval * 1000) {
                return // Belum waktunya tampil
              }
            }
          } else {
            // Tidak ada interval, tampilkan setiap kali
            // Cek session storage untuk sekali per session
            const sessionKey = `popup_shown_${id}`
            if (sessionStorage.getItem(sessionKey)) {
              return // Sudah ditampilkan di session ini
            }
          }

          setPopup(data.popup)
          setIsVisible(true)

          // Simpan waktu tampil
          localStorage.setItem(lastShownKey, Date.now().toString())
          if (!showInterval) {
            sessionStorage.setItem(`popup_shown_${id}`, 'true')
          }

          // Auto close setelah displayDuration
          if (data.popup.displayDuration > 0) {
            setTimeout(() => {
              handleClose()
            }, data.popup.displayDuration * 1000)
          }
        }
      } catch (error) {
        console.error('Failed to fetch popup:', error)
      }
    }

    checkAndShowPopup()
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setPopup(null), 300) // Wait for animation
  }

  const handleClick = () => {
    if (popup?.linkUrl) {
      window.open(popup.linkUrl, '_blank')
    }
  }

  if (!popup || !isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white dark:bg-dark-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 xs:top-3 xs:right-3 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1.5 xs:p-2 transition-all"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div
          className={`${popup.linkUrl ? 'cursor-pointer' : ''}`}
          onClick={handleClick}
        >
          {popup.title && (
            <div className="p-4 xs:p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {popup.title}
              </h2>
            </div>
          )}

          {popup.imageUrl && (
            <div className="relative w-full">
              <img
                src={popup.imageUrl}
                alt={popup.title || 'Popup'}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}

          {popup.linkUrl && (
            <div className="p-4 bg-gray-50 dark:bg-dark-700 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Klik untuk membuka link
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
