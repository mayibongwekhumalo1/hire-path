"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Task } from '@/types/hire.types';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (taskData: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      router.push(`/dashboard/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
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
        <button
          onClick={() => router.push('/dashboard/tasks')}
          className="text-emerald-600 hover:text-emerald-900"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-600">Update task details</p>
      </div>

      <TaskForm
        initialData={task}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}