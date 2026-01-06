"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCardSkeleton, RecentHiresSkeleton } from '@/components/ui/skeleton';
import { DashboardStats, Hire, Activity, DepartmentPerformance } from '@/types/hire.types';
import { formatDate, getInitials } from '@/lib/utils/string.utils';

function StatsCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  loading = false,
  children
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  if (loading) {
    return <StatsCardSkeleton />;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {changeType === 'positive' && '↗️'}
              {changeType === 'negative' && '↘️'}
              {change > 0 ? '+' : ''}{change}{typeof change === 'number' && title.includes('%') ? '%' : ''}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-2xl">{icon}</div>
        )}
        {children}
      </div>
    </Card>
  );
}

function ProgressCircle({ progress, size = 60 }: { progress: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-900">{progress}%</span>
      </div>
    </div>
  );
}

function RecentHiresTable({ hires, loading }: { hires: Hire[]; loading: boolean }) {
  if (loading) {
    return <RecentHiresSkeleton />;
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Hires</h3>
          <Button variant="outline" size="sm">
            View All Hires
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {hires.map((hire) => (
          <div key={hire.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-emerald-700">
                      {getInitials(`${hire.firstName} ${hire.lastName}`)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {hire.firstName} {hire.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{hire.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{formatDate(hire.startDate)}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  hire.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  hire.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  hire.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {hire.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
      </div>

      <div className="px-6 py-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-700">
                          {activity.type === 'hire_created' && '👥'}
                          {activity.type === 'task_completed' && '✅'}
                          {activity.type === 'status_changed' && '🔄'}
                          {activity.type === 'hire_completed' && '🎉'}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(activity.timestamp, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function DepartmentChart({ performance }: { performance: DepartmentPerformance[] }) {
  const maxHires = Math.max(...performance.map(d => d.hires));

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-4">
          {performance.map((dept) => (
            <div key={dept.department} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                  <span className="text-sm text-gray-500">{dept.hires} hires</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(dept.hires / maxHires) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentHires, setRecentHires] = useState<Hire[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent hires
        const hiresResponse = await fetch('/api/hires?page=1&pageSize=5');
        const hiresData = await hiresResponse.json();
        setRecentHires(hiresData.hires || []);

        // Fetch activities
        const activitiesResponse = await fetch('/api/dashboard/activities');
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

        // Fetch department performance
        const departmentsResponse = await fetch('/api/dashboard/departments');
        const departmentsData = await departmentsResponse.json();
        setDepartmentPerformance(departmentsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, John! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Today is {format(today, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Quick Stats</p>
            <p className="text-lg font-semibold text-gray-900">
              3 hires this week • 8 tasks due today ⚠️
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Hires"
          value={stats?.totalHires || 0}
          change={stats?.hiresChange}
          changeType="positive"
          loading={loading}
        />

        <StatsCard
          title="Active Onboarding"
          value={stats?.activeOnboarding || 0}
          loading={loading}
        >
          <div className="mt-4">
            <ProgressCircle progress={stats?.onboardingProgress || 0} />
          </div>
        </StatsCard>

        <StatsCard
          title="Tasks Due Today"
          value={stats?.tasksDueToday || 0}
          icon="⚠️"
          loading={loading}
        />

        <StatsCard
          title="Avg. Time to Complete"
          value={`${stats?.avgTimeToComplete || 0} days`}
          loading={loading}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <RecentHiresTable hires={recentHires} loading={loading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ActivityTimeline activities={activities} />
          <DepartmentChart performance={departmentPerformance} />
        </div>
      </div>
    </div>
  );
}