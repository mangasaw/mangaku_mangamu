import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createSession(userId: string, sessionToken: string, deviceInfo?: string, ipAddress?: string) {
  // Delete all previous active sessions for this user (single session enforcement)
  await prisma.userSession.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false }
  })

  // Create new session
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

  const session = await prisma.userSession.create({
    data: {
      userId,
      sessionToken,
      deviceInfo,
      ipAddress,
      expiresAt,
      isActive: true,
      lastActivity: new Date()
    }
  })

  return session
}

export async function validateSession(sessionToken: string) {
  const session = await prisma.userSession.findFirst({
    where: {
      sessionToken,
      isActive: true,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  })

  if (!session) {
    return null
  }

  // Update last activity
  await prisma.userSession.update({
    where: { id: session.id },
    data: { lastActivity: new Date() }
  })

  return session
}

export async function invalidateSession(sessionToken: string) {
  return await prisma.userSession.updateMany({
    where: { sessionToken },
    data: { isActive: false }
  })
}

export async function invalidateUserSessions(userId: string) {
  return await prisma.userSession.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false }
  })
}
