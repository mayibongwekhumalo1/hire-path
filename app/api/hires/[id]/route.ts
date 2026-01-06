import { NextRequest, NextResponse } from 'next/server'
import { HireService } from '@/controllers/hire.service'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const hire = await HireService.getHireById(id)

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
    const { id } = await params;
    const body = await request.json()
    const hire = await HireService.updateHire(id, body)

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
    const { id } = await params;
    const success = await HireService.deleteHire(id)

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