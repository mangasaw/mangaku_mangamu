import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAdsByPosition(position?: string) {
  const whereClause = position 
    ? { position: position as any, isActive: true }
    : { isActive: true }

  const ads = await prisma.ad.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  })

  return ads
}

export async function createAd(name: string, code: string, position: string) {
  const ad = await prisma.ad.create({
    data: {
      name,
      code,
      position: position as any,
      isActive: true
    }
  })

  return ad
}

export async function updateAd(id: string, data: { name?: string, code?: string, position?: any, isActive?: boolean }) {
  const ad = await prisma.ad.update({
    where: { id },
    data
  })

  return ad
}

export async function deleteAd(id: string) {
  await prisma.ad.delete({
    where: { id }
  })
}

export async function getAdPlacements() {
  const positions = [
    { value: 'HEADER', label: 'Header (atas)', description: 'Iklan di bagian atas halaman' },
    { value: 'SIDEBAR_LEFT', label: 'Sidebar Kiri', description: 'Iklan di sidebar kiri' },
    { value: 'SIDEBAR_RIGHT', label: 'Sidebar Kanan', description: 'Iklan di sidebar kanan' },
    { value: 'BEFORE_CONTENT', label: 'Sebelum Konten', description: 'Iklan sebelum konten utama' },
    { value: 'AFTER_CONTENT', label: 'Setelah Konten', description: 'Iklan setelah konten utama' },
    { value: 'FOOTER', label: 'Footer (bawah)', description: 'Iklan di bagian bawah halaman' },
    { value: 'INLINE', label: 'Inline', description: 'Iklan di tengah konten' },
  ]

  return positions
}
