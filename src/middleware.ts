import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of admin routes that need protection
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isAdminRoute) {
    // TODO: Implement proper authentication check
    // For now, this is a placeholder
    // In production, check session/JWT token here
    
    const isAuthenticated = true // Replace with actual auth check
    const isAdmin = true // Replace with actual admin role check

    if (!isAuthenticated || !isAdmin) {
      // Redirect to login if not authenticated or not admin
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
