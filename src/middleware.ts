import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  // Check if user is trying to access admin routes
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (token) {
    // Check for single session enforcement
    const sessionToken = token.sessionToken as string
    const userId = token.id as string

    try {
      // Check if session is still valid
      const session = await prisma.userSession.findFirst({
        where: {
          userId,
          sessionToken,
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      })

      // If session not found or expired, redirect to logout
      if (!session) {
        const logoutUrl = new URL('/api/auth/logout', req.url)
        return NextResponse.redirect(logoutUrl)
      }

      // Update last activity
      await prisma.userSession.update({
        where: { id: session.id },
        data: { lastActivity: new Date() }
      })

      // Check for admin role
      if (isAdminRoute && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }

    } catch (error) {
      console.error('Session check error:', error)
      // Continue if there's a DB error
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/api/popup/:path*',
    '/api/ads/:path*',
    '/api/upload/:path*',
  ],
}
