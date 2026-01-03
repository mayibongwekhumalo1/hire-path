"use client";

import { TaskCard } from './TaskCard';
import { Task } from '@/types/hire.types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  showHireLink?: boolean;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onToggleComplete,
  showHireLink = true,
  emptyMessage = "No tasks found"
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          showHireLink={showHireLink}
        />
      ))}
    </div>
  );
}