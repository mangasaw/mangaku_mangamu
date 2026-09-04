'use client'

import { useEffect, RefObject } from 'react'

interface GestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
}

export function useGestures(
  elementRef: RefObject<HTMLElement>,
  handlers: GestureHandlers
) {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let touchStartX = 0
    let touchStartY = 0
    let touchStartTime = 0
    let lastTapTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        touchStartTime = Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const touchEndTime = Date.now()

      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const deltaTime = touchEndTime - touchStartTime
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Tap detection (short duration, small distance)
      if (distance < 10 && deltaTime < 300) {
        const now = Date.now()
        const timeSinceLastTap = now - lastTapTime

        if (timeSinceLastTap < 300 && handlers.onDoubleTap) {
          // Double tap
          handlers.onDoubleTap()
          lastTapTime = 0
        } else if (handlers.onTap) {
          // Single tap
          handlers.onTap()
          lastTapTime = now
        }
      }
      // Swipe detection
      else if (distance > 50 && deltaTime < 500) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight()
          } else if (deltaX < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft()
          }
        }
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef, handlers])
}
