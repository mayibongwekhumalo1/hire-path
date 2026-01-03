"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/hire.types';

export function useTasks(hireId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = hireId ? `/api/tasks?hireId=${hireId}` : '/api/tasks';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [hireId]);

  const refetch = () => {
    fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    refetch,
  };
}