import { NextRequest, NextResponse } from 'next/server'
import { HireService } from '@/lib/services/hire.service'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const hire = await HireService.getHireById(params.id)

    if (!hire) {
      return NextResponse.json(
        { error: 'Hire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hire)
  } catch (error) {
    console.error('Error fetching hire:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hire' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const hire = await HireService.updateHire(params.id, body)

    if (!hire) {
      return NextResponse.json(
        { error: 'Hire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hire)
  } catch (error) {
    console.error('Error updating hire:', error)
    return NextResponse.json(
      { error: 'Failed to update hire' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await HireService.deleteHire(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Hire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Hire deleted successfully' })
  } catch (error) {
    console.error('Error deleting hire:', error)
    return NextResponse.json(
      { error: 'Failed to delete hire' },
      { status: 500 }
    )
  }
}