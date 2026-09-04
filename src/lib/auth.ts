import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) {
    return { authorized: false, error: 'Unauthorized' }
  }
  
  if (token.role !== 'ADMIN') {
    return { authorized: false, error: 'Forbidden - Admin only' }
  }
  
  return { authorized: true, userId: token.id as string }
}
