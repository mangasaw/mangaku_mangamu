import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'user@manga.com'
  const username = 'testuser'
  const password = 'user123'

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('❌ User already exists!')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    }
  })

  console.log('✅ Regular user created successfully!')
  console.log('📧 Email:', email)
  console.log('👤 Username:', username)
  console.log('🔑 Password:', password)
  console.log('🆔 User ID:', user.id)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
