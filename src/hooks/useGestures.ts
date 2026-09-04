'use client'

import { useEffect, useRef, RefObject } from 'react'

interface GestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  onPinchIn?: () => void
  onPinchOut?: () => void
}

export function useGestures(
  elementRef: RefObject<HTMLElement>,
  handlers: GestureHandlers
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTapRef = useRef<number>(0)
  const initialDistanceRef = useRef<number>(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Touch start handler
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        }
      } else if (e.touches.length === 2) {
        // Pinch gesture
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        initialDistanceRef.current = Math.sqrt(dx * dx + dy * dy)
      }
    }

    // Touch end handler
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      }

      const deltaX = touchEnd.x - touchStartRef.current.x
      const deltaY = touchEnd.y - touchStartRef.current.y
      const deltaTime = touchEnd.time - touchStartRef.current.time
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Tap detection (short duration, small distance)
      if (distance < 10 && deltaTime < 300) {
        const now = Date.now()
        const timeSinceLastTap = now - lastTapRef.current

        if (timeSinceLastTap < 300 && handlers.onDoubleTap) {
          // Double tap
          handlers.onDoubleTap()
          lastTapRef.current = 0
        } else if (handlers.onTap) {
          // Single tap
          handlers.onTap()
          lastTapRef.current = now
        }
      }
      // Swipe detection (longer distance, reasonable speed)
      else if (distance > 50 && deltaTime < 500) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI

        if (angle > -45 && angle <= 45 && handlers.onSwipeRight) {
          // Swipe right
          handlers.onSwipeRight()
        } else if (angle > 45 && angle <= 135 && handlers.onSwipeDown) {
          // Swipe down
          handlers.onSwipeDown()
        } else if ((angle > 135 || angle <= -135) && handlers.onSwipeLeft) {
          // Swipe left
          handlers.onSwipeLeft()
        } else if (angle > -135 && angle <= -45 && handlers.onSwipeUp) {
          // Swipe up
          handlers.onSwipeUp()
        }
      }

      touchStartRef.current = null
    }

    // Touch move handler for pinch
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistanceRef.current > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const currentDistance = Math.sqrt(dx * dx + dy * dy)
        
        const diff = currentDistance - initialDistanceRef.current

        if (Math.abs(diff) > 50) {
          if (diff > 0 && handlers.onPinchOut) {
            handlers.onPinchOut()
            initialDistanceRef.current = currentDistance
          } else if (diff < 0 && handlers.onPinchIn) {
            handlers.onPinchIn()
            initialDistanceRef.current = currentDistance
          }
        }
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [elementRef, handlers])
}

// Mouse gesture support for desktop
export function useMouseGestures(
  elementRef: RefObject<HTMLElement>,
  handlers: GestureHandlers
) {
  const mouseDownRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastClickRef = useRef<number>(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseDownRef.current) return

      const deltaX = e.clientX - mouseDownRef.current.x
      const deltaY = e.clientY - mouseDownRef.current.y
      const deltaTime = Date.now() - mouseDownRef.current.time
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Click detection
      if (distance < 10 && deltaTime < 300) {
        const now = Date.now()
        const timeSinceLastClick = now - lastClickRef.current

        if (timeSinceLastClick < 300 && handlers.onDoubleTap) {
          handlers.onDoubleTap()
          lastClickRef.current = 0
        } else if (handlers.onTap) {
          handlers.onTap()
          lastClickRef.current = now
        }
      }

      mouseDownRef.current = null
    }

    // Wheel for zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0 && handlers.onPinchOut) {
          handlers.onPinchOut()
        } else if (e.deltaY > 0 && handlers.onPinchIn) {
          handlers.onPinchIn()
        }
      }
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mouseup', handleMouseUp)
    element.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mouseup', handleMouseUp)
      element.removeEventListener('wheel', handleWheel)
    }
  }, [elementRef, handlers])
}
