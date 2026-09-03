import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 All users in database:')
  console.log('━'.repeat(50))
  
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  if (users.length === 0) {
    console.log('❌ No users found in database!')
    return
  }

  users.forEach((user, index) => {
    console.log(`\nUser #${index + 1}:`)
    console.log(`  🆔 ID: ${user.id}`)
    console.log(`  📧 Email: ${user.email}`)
    console.log(`  👤 Username: ${user.username}`)
    console.log(`  🔐 Password (hash): ${user.password.substring(0, 20)}...`)
    console.log(`  👑 Role: ${(user as any).role || 'USER'}`)
    console.log(`  📅 Created: ${user.createdAt}`)
  })

  console.log('\n━'.repeat(50))
  console.log('✅ Total users:', users.length)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
