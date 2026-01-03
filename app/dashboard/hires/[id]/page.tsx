"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockData } from '@/lib/utils/mock-data';
import { Hire, Task } from '@/types/hire.types';
import { formatDate, getInitials } from '@/lib/utils/string.utils';

function TaskItem({ task }: { task: Task }) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    const colors = {
      IT: 'bg-blue-100 text-blue-800',
      FACILITIES: 'bg-purple-100 text-purple-800',
      HR: 'bg-pink-100 text-pink-800',
      SECURITY: 'bg-red-100 text-red-800',
      MANAGER: 'bg-green-100 text-green-800',
      COMPLIANCE: 'bg-orange-100 text-orange-800',
      TRAINING: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            {task.completed && (
              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Due: {formatDate(task.dueDate)}</span>
            <span>•</span>
            <span>Assigned to: {task.assignedTo}</span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getPriorityColor(task.priority)} variant="secondary">
            {task.priority}
          </Badge>
          <Badge className={getCategoryColor(task.category)} variant="secondary">
            {task.category}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function HireDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hire, setHire] = useState<Hire | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHireData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const hireId = params.id as string;
      const hireData = mockData.getHireById(hireId);
      const tasksData = mockData.getTasksByHireId(hireId);

      setHire(hireData || null);
      setTasks(tasksData);
      setLoading(false);
    };

    if (params.id) {
      loadHireData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hire) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hire Not Found</h2>
        <p className="text-gray-600 mb-6">The hire you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/hires')}>
          Back to Hires
        </Button>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (status: Hire['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {hire.firstName} {hire.lastName}
            </h1>
            <p className="text-gray-600">{hire.jobTitle} • {hire.department}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/hires/${hire.id}/edit`}>
            <Button variant="outline">Edit Hire</Button>
          </Link>
          <Button>Mark as Complete</Button>
        </div>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge className={getStatusColor(hire.status)} variant="secondary">
                {hire.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(hire.startDate)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <div className="flex items-center space-x-2">
                <Progress value={progressPercentage} className="flex-1" />
                <span className="text-sm font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{completedTasks} of {totalTasks} tasks completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hire Information */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hire Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{hire.email}</p>
              </div>
              {hire.personalEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Personal Email</label>
                  <p className="text-sm text-gray-900">{hire.personalEmail}</p>
                </div>
              )}
              {hire.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-900">{hire.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600">Employment Type</label>
                <p className="text-sm text-gray-900">{hire.employmentType.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Work Location</label>
                <p className="text-sm text-gray-900">{hire.workLocation}</p>
              </div>
              {hire.managerName && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Manager</label>
                  <p className="text-sm text-gray-900">{hire.managerName}</p>
                  {hire.managerEmail && (
                    <p className="text-sm text-gray-600">{hire.managerEmail}</p>
                  )}
                </div>
              )}
              {hire.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-sm text-gray-900">{hire.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tasks */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tasks ({totalTasks})</h2>
              <Button variant="outline" size="sm">Add Task</Button>
            </div>
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tasks assigned yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}