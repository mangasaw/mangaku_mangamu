import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@manga.com'
  const username = 'admin'
  const password = 'admin123' // Ganti dengan password yang kuat

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('❌ Admin user already exists!')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log('📧 Email:', email)
  console.log('👤 Username:', username)
  console.log('🔑 Password:', password)
  console.log('🆔 User ID:', admin.id)
  console.log('\n⚠️  IMPORTANT: Change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
