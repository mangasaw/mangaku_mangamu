import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const popup = await prisma.popup.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ popup })
  } catch (error) {
    console.error('Error fetching active popup:', error)
    return NextResponse.json({ popup: null }, { status: 500 })
  }
}
