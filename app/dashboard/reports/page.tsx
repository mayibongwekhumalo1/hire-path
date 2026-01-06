"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockData } from '@/lib/utils/mock-data';
import { DashboardStats, DepartmentPerformance, Hire } from '@/types/hire.types';
import { formatDate } from '@/lib/utils/string.utils';

function MetricCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}) {
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
          <div className="text-3xl">{icon}</div>
        )}
      </div>
    </Card>
  );
}

function DepartmentChart({ performance }: { performance: DepartmentPerformance[] }) {
  const maxHires = Math.max(...performance.map(d => d.hires));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hires by Department</h3>
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
    </Card>
  );
}

function CompletionRateChart({ performance }: { performance: DepartmentPerformance[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rates by Department</h3>
      <div className="space-y-4">
        {performance.map((dept) => (
          <div key={dept.department} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                <span className="text-sm text-gray-500">{dept.completionRate}%</span>
              </div>
              <Progress value={dept.completionRate} className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimeToCompleteChart({ performance }: { performance: DepartmentPerformance[] }) {
  const maxTime = Math.max(...performance.map(d => d.avgTime));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Time to Complete (Days)</h3>
      <div className="space-y-4">
        {performance.map((dept) => (
          <div key={dept.department} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                <span className="text-sm text-gray-500">{dept.avgTime} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dept.avgTime / maxTime) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentHiresTable({ hires }: { hires: Hire[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Hires</h3>
        <Button variant="outline" size="sm">Export Report</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hires.slice(0, 10).map((hire) => (
              <tr key={hire.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {hire.firstName} {hire.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{hire.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{hire.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(hire.startDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    hire.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    hire.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    hire.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {hire.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [recentHires, setRecentHires] = useState<Hire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportsData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats(mockData.getDashboardStats());
      setDepartmentPerformance(mockData.getDepartmentPerformance());
      setRecentHires(mockData.getRecentHires(20));

      setLoading(false);
    };

    loadReportsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalHires = recentHires.length;
  const activeHires = recentHires.filter(h => h.status === 'ACTIVE').length;
  const completedHires = recentHires.filter(h => h.status === 'COMPLETED').length;
  const completionRate = totalHires > 0 ? Math.round((completedHires / totalHires) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your hiring process</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export All</Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Hires"
          value={stats?.totalHires || 0}
          change={stats?.hiresChange}
          changeType="positive"
          icon="👥"
        />

        <MetricCard
          title="Active Onboarding"
          value={stats?.activeOnboarding || 0}
          icon="⚡"
        />

        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          change={5}
          changeType="positive"
          icon="✅"
        />

        <MetricCard
          title="Avg. Time to Complete"
          value={`${stats?.avgTimeToComplete || 0} days`}
          change={-0.5}
          changeType="positive"
          icon="⏱️"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentChart performance={departmentPerformance} />
        <CompletionRateChart performance={departmentPerformance} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeToCompleteChart performance={departmentPerformance} />
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">+12 hires</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-sm font-medium text-gray-900">+8 hires</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-medium text-green-600">+50%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Hires Table */}
      <RecentHiresTable hires={recentHires} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Department</h3>
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {departmentPerformance.reduce((prev, current) =>
              (prev.completionRate > current.completionRate) ? prev : current
            ).department}
          </div>
          <p className="text-sm text-gray-600">
            Highest completion rate this quarter
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fastest Onboarding</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {departmentPerformance.reduce((prev, current) =>
              (prev.avgTime < current.avgTime) ? prev : current
            ).avgTime} days
          </div>
          <p className="text-sm text-gray-600">
            Average time to complete onboarding
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Due Today</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {stats?.tasksDueToday || 0}
          </div>
          <p className="text-sm text-gray-600">
            Urgent items requiring attention
          </p>
        </Card>
      </div>
    </div>
  );
}