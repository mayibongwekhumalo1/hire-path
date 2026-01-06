"use client";

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/hire.types';
import { formatDate } from '@/lib/utils/string.utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  showHireLink?: boolean;
}

export function TaskCard({ task, onToggleComplete, showHireLink = true }: TaskCardProps) {
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

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete?.(task.id)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={getPriorityColor(task.priority)} variant="secondary">
              {task.priority}
            </Badge>
            <Badge className={getCategoryColor(task.category)} variant="secondary">
              {task.category}
            </Badge>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <div>Assigned to: {task.assignedTo}</div>
            <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
              Due: {formatDate(task.dueDate)}
              {isOverdue && ' ⚠️ Overdue'}
            </div>
            {showHireLink && (
              <div>
                <Link
                  href={`/dashboard/hires/${task.hireId}`}
                  className="text-emerald-600 hover:text-emerald-900"
                >
                  View Hire
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4">
          <Link href={`/dashboard/tasks/${task.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}