import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Update admin user role to ADMIN
  const adminEmail = 'admin@manga.com'
  
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!admin) {
    console.log('❌ Admin user not found!')
    return
  }

  await prisma.user.update({
    where: { id: admin.id },
    data: { role: 'ADMIN' }
  })

  console.log('✅ Admin user updated to ADMIN role!')
  console.log('📧 Email:', adminEmail)
  console.log('👤 Current role:', admin.role)
  console.log('🆔 User ID:', admin.id)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
