import { NextResponse } from 'next/server';
import { HireService } from '@/controllers/hire.service';
import { DepartmentPerformance } from '@/types/hire.types';

export async function GET() {
  try {
    const allHires = await HireService.getAllHires();

    // Group hires by department
    const departmentMap = new Map<string, any[]>();

    allHires.forEach(hire => {
      if (!departmentMap.has(hire.department)) {
        departmentMap.set(hire.department, []);
      }
      departmentMap.get(hire.department)!.push(hire);
    });

    // Calculate performance for each department
    const departmentPerformance: DepartmentPerformance[] = Array.from(departmentMap.entries()).map(([department, hires]) => {
      const totalHires = hires.length;
      const completedHires = hires.filter(h => h.status === 'COMPLETED').length;
      const completionRate = totalHires > 0 ? Math.round((completedHires / totalHires) * 100) : 0;

      // Calculate average time to complete
      const completedHiresWithDates = hires.filter(h =>
        h.status === 'COMPLETED' && h.completedAt && h.createdAt
      );

      let avgTime = 0;
      if (completedHiresWithDates.length > 0) {
        const totalTime = completedHiresWithDates.reduce((sum, hire) => {
          const timeDiff = hire.completedAt!.getTime() - hire.createdAt.getTime();
          return sum + (timeDiff / (1000 * 60 * 60 * 24)); // days
        }, 0);
        avgTime = Math.round(totalTime / completedHiresWithDates.length);
      }

      return {
        department,
        hires: totalHires,
        completionRate,
        avgTime,
      };
    });

    // Sort by number of hires descending
    departmentPerformance.sort((a, b) => b.hires - a.hires);

    return NextResponse.json(departmentPerformance);
  } catch (error) {
    console.error('Error fetching department performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department performance' },
      { status: 500 }
    );
  }
}