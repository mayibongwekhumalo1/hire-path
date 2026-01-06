import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    // Test the connection by getting database stats
    const db = await getDatabase()
    const stats = await db.stats()
    return NextResponse.json({
      message: 'Database connected successfully',
      stats: {
        db: stats.db,
        collections: stats.collections,
        objects: stats.objects
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}