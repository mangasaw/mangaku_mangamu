import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 60 // 60 detik

export async function checkLoginAttempts(email: string, ipAddress?: string, userAgent?: string) {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
  
  // Cek attempt terakhir dalam 1 menit
  const recentAttempts = await prisma.failedLoginAttempt.count({
    where: {
      email,
      attemptedAt: { gte: oneMinuteAgo },
      isLocked: false
    }
  })

  // Cek apakah user sedang di-lockout
  const lockedAttempt = await prisma.failedLoginAttempt.findFirst({
    where: {
      email,
      isLocked: true,
      lockedUntil: { gt: new Date() }
    }
  })

  if (lockedAttempt) {
    const remainingSeconds = Math.ceil((lockedAttempt.lockedUntil!.getTime() - Date.now()) / 1000)
    return { 
      locked: true, 
      remainingSeconds,
      message: `Akun terkunci. Coba lagi dalam ${remainingSeconds} detik.`
    }
  }

  if (recentAttempts >= MAX_ATTEMPTS - 1) {
    // Kunci akun selama 60 detik
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION * 1000)
    
    await prisma.failedLoginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        isLocked: true,
        lockedUntil
      }
    })

    return { 
      locked: true, 
      remainingSeconds: LOCKOUT_DURATION,
      message: `Terlalu banyak percobaan gagal. Akun terkunci selama ${LOCKOUT_DURATION} detik.`
    }
  }

  return { locked: false }
}

export async function recordFailedAttempt(email: string, ipAddress?: string, userAgent?: string) {
  const attempt = await prisma.failedLoginAttempt.create({
    data: {
      email,
      ipAddress,
      userAgent,
      isLocked: false
    }
  })

  return attempt
}

export async function clearFailedAttempts(email: string) {
  await prisma.failedLoginAttempt.deleteMany({
    where: { email }
  })
}

export async function cleanupOldAttempts() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  await prisma.failedLoginAttempt.deleteMany({
    where: {
      attemptedAt: { lt: oneHourAgo },
      isLocked: false
    }
  })
}
