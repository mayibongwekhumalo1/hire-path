"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, Hire } from '@/types/hire.types';
import { formatDate } from '@/lib/utils/string.utils';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [hire, setHire] = useState<Hire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const taskId = params.id as string;

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Task not found');
          } else {
            setError('Failed to load task');
          }
          return;
        }
        const taskData = await response.json();
        setTask(taskData);

        // Load hire data - need to add hire API or use existing
        // For now, skip hire data or add API
        // const hireResponse = await fetch(`/api/hires/${taskData.hireId}`);
        // if (hireResponse.ok) {
        //   const hireData = await hireResponse.json();
        //   setHire(hireData);
        // }
      } catch (err) {
        console.error('Failed to load task:', err);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Task not found'}
        </h2>
        <Button onClick={() => router.push('/dashboard/tasks')}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600">Task Details</p>
        </div>
        <div className="flex space-x-3">
          <Link href={`/dashboard/tasks/${task.id}/edit`}>
            <Button variant="outline">Edit Task</Button>
          </Link>
          <Button onClick={() => router.push('/dashboard/tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.title}</dd>
            </div>
            {task.description && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{task.description}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.assignedTo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className={`mt-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                {formatDate(task.dueDate)}
                {isOverdue && ' ⚠️ Overdue'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1">
                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                  {task.priority}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1">
                <Badge className={getCategoryColor(task.category)} variant="secondary">
                  {task.category}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                {task.completed && task.completedAt && (
                  <div className="mt-1 text-xs text-gray-500">
                    Completed on {formatDate(task.completedAt)}
                  </div>
                )}
              </dd>
            </div>
            {task.notes && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{task.notes}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Related Hire */}
        {hire && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Related Hire</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {hire.firstName} {hire.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{hire.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{hire.jobTitle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">{hire.department}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{hire.status}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <Link href={`/dashboard/hires/${hire.id}`}>
                <Button variant="outline" size="sm">
                  View Hire Details
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}