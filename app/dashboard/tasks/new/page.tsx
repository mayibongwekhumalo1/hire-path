
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Task } from '@/types/hire.types';

export default function NewTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (taskData: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      router.push('/dashboard/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600">Add a new onboarding task for a hire</p>
      </div>

      <TaskForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}