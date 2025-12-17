import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the connection by running a simple query
    await prisma.$connect()
    return NextResponse.json({ message: 'Database connected successfully' })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}