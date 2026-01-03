import { NextRequest, NextResponse } from 'next/server'
import { HireService } from '@/controllers/hire.service'
import { HireFilters } from '@/types/hire.types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: HireFilters = {
      status: searchParams.get('status') as any || undefined,
      department: searchParams.get('department') || undefined,
      employmentType: searchParams.get('employmentType') as any || undefined,
      search: searchParams.get('search') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const result = await HireService.getHires(filters, page, pageSize)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching hires:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hires' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const hire = await HireService.createHire(body)

    return NextResponse.json(hire, { status: 201 })
  } catch (error) {
    console.error('Error creating hire:', error)
    return NextResponse.json(
      { error: 'Failed to create hire' },
      { status: 500 }
    )
  }
}