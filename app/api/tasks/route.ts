import { NextRequest, NextResponse } from 'next/server'
import { TaskService } from '@/controllers/task.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hireId = searchParams.get('hireId')

    if (hireId) {
      // Get tasks for specific hire
      const tasks = await TaskService.getTasksByHireId(hireId)
      return NextResponse.json(tasks)
    } else {
      // Get all tasks - need to implement this
      // For now, return empty array or implement getAllTasks
      const tasks = await TaskService.getAllTasks()
      return NextResponse.json(tasks)
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const task = await TaskService.createTask(body)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}