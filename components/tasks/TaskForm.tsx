"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';
import { DatePicker } from '@/components/ui/form/date-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task, Hire, SelectOption, Priority, TaskCategory } from '@/types/hire.types';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

const priorityOptions: SelectOption[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

const categoryOptions: SelectOption[] = [
  { value: 'IT', label: 'IT' },
  { value: 'FACILITIES', label: 'Facilities' },
  { value: 'HR', label: 'HR' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'TRAINING', label: 'Training' },
];

export function TaskForm({ initialData, onSubmit, isLoading = false }: TaskFormProps) {
  const router = useRouter();
  const [hires, setHires] = useState<Hire[]>([]);
  const [loadingHires, setLoadingHires] = useState(true);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignedTo: initialData?.assignedTo || '',
    dueDate: initialData?.dueDate,
    priority: initialData?.priority || 'MEDIUM' as Priority,
    category: initialData?.category || 'IT' as TaskCategory,
    hireId: initialData?.hireId || '',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadHires = async () => {
      try {
        // For now, use mock data or add hire API
        // Since we don't have hire API, let's use mock data
        const mockData = await import('@/lib/utils/mock-data');
        const allHires = mockData.mockData.getHires().data;
        setHires(allHires);
      } catch (error) {
        console.error('Failed to load hires:', error);
      } finally {
        setLoadingHires(false);
      }
    };

    loadHires();
  }, []);

  const hireOptions: SelectOption[] = hires.map(hire => ({
    value: hire.id,
    label: `${hire.firstName} ${hire.lastName} - ${hire.jobTitle}`,
  }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned to is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (formData.dueDate < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (!formData.hireId) {
      newErrors.hireId = 'Hire selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate!,
        completed: initialData?.completed || false,
      });
    } catch (error) {
      console.error('Failed to submit task:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            error={errors.title}
            required
            placeholder="Enter task title"
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="Enter task description (optional)"
          />

          <Input
            label="Assigned To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={(value) => handleInputChange('assignedTo', value)}
            error={errors.assignedTo}
            required
            placeholder="Enter assignee name or email"
          />

          <DatePicker
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(date) => handleInputChange('dueDate', date)}
            error={errors.dueDate}
            required
            minDate={new Date()}
          />

          <Select
            label="Priority"
            name="priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value)}
            required
          />

          <Select
            label="Category"
            name="category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            required
          />

          <Select
            label="Related Hire"
            name="hireId"
            options={hireOptions}
            value={formData.hireId}
            onChange={(value) => handleInputChange('hireId', value)}
            error={errors.hireId}
            required
            placeholder={loadingHires ? "Loading hires..." : "Select a hire"}
            disabled={loadingHires}
          />

          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={(value) => handleInputChange('notes', value)}
            placeholder="Additional notes (optional)"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={loadingHires}
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
}