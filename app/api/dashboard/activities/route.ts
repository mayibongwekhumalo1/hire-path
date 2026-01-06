import { NextResponse } from 'next/server';
import { HireService } from '@/controllers/hire.service';
import { TaskService } from '@/controllers/task.service';
import { Activity } from '@/types/hire.types';

export async function GET() {
  try {
    // Get recent hires (last 10)
    const recentHires = await HireService.getAllHires();
    recentHires.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const recentHiresSlice = recentHires.slice(0, 10);

    // Get recent tasks (last 10 completed)
    const allTasks = await TaskService.getAllTasks();
    const completedTasks = allTasks.filter(task => task.completed).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10);

    // Generate activities from recent data
    const activities: Activity[] = [];

    // Add hire creation activities
    recentHiresSlice.forEach(hire => {
      activities.push({
        id: `hire-${hire.id}`,
        type: 'hire_created',
        message: `New hire ${hire.firstName} ${hire.lastName} was added to ${hire.department}`,
        timestamp: hire.createdAt,
        hireId: hire.id,
      });
    });

    // Add task completion activities
    completedTasks.forEach(task => {
      const hire = recentHires.find(h => h.id === task.hireId);
      if (hire) {
        activities.push({
          id: `task-${task.id}`,
          type: 'task_completed',
          message: `${hire.firstName} ${hire.lastName} completed "${task.title}"`,
          timestamp: task.updatedAt,
          hireId: hire.id,
        });
      }
    });

    // Sort by timestamp descending and take top 10
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const recentActivities = activities.slice(0, 10);

    return NextResponse.json(recentActivities);
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
}