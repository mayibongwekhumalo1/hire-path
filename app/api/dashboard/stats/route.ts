import { NextResponse } from 'next/server';
import { HireService } from '@/controllers/hire.service';
import { TaskService } from '@/controllers/task.service';

export async function GET() {
  try {
    // Get total hires
    const allHires = await HireService.getAllHires();
    const totalHires = allHires.length;

    // Calculate hires change (mock for now, could be compared to previous period)
    const hiresChange = 12; // +12%

    // Get active onboarding (hires with status ACTIVE or PENDING)
    const activeOnboarding = allHires.filter(hire =>
      hire.status === 'ACTIVE' || hire.status === 'PENDING'
    ).length;

    // Calculate onboarding progress (average completion percentage)
    const completedHires = allHires.filter(hire => hire.status === 'COMPLETED').length;
    const onboardingProgress = totalHires > 0 ? Math.round((completedHires / totalHires) * 100) : 0;

    // Get tasks due today
    const tasksDueToday = await TaskService.getTasksDueToday();
    const tasksDueTodayCount = tasksDueToday.length;

    // Calculate average time to complete (for completed hires)
    const completedHiresWithDates = allHires.filter(hire =>
      hire.status === 'COMPLETED' && hire.completedAt && hire.createdAt
    );

    let avgTimeToComplete = 0;
    if (completedHiresWithDates.length > 0) {
      const totalTime = completedHiresWithDates.reduce((sum, hire) => {
        const timeDiff = hire.completedAt!.getTime() - hire.createdAt.getTime();
        return sum + (timeDiff / (1000 * 60 * 60 * 24)); // days
      }, 0);
      avgTimeToComplete = Math.round((totalTime / completedHiresWithDates.length) * 10) / 10;
    }

    const stats = {
      totalHires,
      hiresChange,
      activeOnboarding,
      onboardingProgress,
      tasksDueToday: tasksDueTodayCount,
      avgTimeToComplete,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}