"use client";

import { useState, useEffect, useMemo } from 'react';
import { SearchBar } from '@/components/shared/search-bar';
import { FilterButtons } from '@/components/shared/filter-buttons';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { TableSkeleton } from '@/components/ui/skeleton';
import { mockData } from '@/lib/utils/mock-data';
import { Task, FilterOption } from '@/types/hire.types';
import { formatDate } from '@/lib/utils/string.utils';

const ITEMS_PER_PAGE = 10;

const statusFilterOptions: FilterOption[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

const priorityFilterOptions: FilterOption[] = [
  { id: 'all', label: 'All Priorities' },
  { id: 'CRITICAL', label: 'Critical' },
  { id: 'HIGH', label: 'High' },
  { id: 'MEDIUM', label: 'Medium' },
  { id: 'LOW', label: 'Low' },
];

const categoryFilterOptions: FilterOption[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'IT', label: 'IT' },
  { id: 'FACILITIES', label: 'Facilities' },
  { id: 'HR', label: 'HR' },
  { id: 'SECURITY', label: 'Security' },
  { id: 'MANAGER', label: 'Manager' },
  { id: 'COMPLIANCE', label: 'Compliance' },
  { id: 'TRAINING', label: 'Training' },
];

function TaskRow({
  task,
  onToggleComplete,
  onViewHire
}: {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onViewHire: (hireId: string) => void;
}) {
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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </div>
          {task.description && (
            <div className="text-sm text-gray-500">{task.description}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onViewHire(task.hireId)}
          className="text-emerald-600 hover:text-emerald-900 text-sm"
        >
          View Hire
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{task.assignedTo}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
          {formatDate(task.dueDate)}
          {isOverdue && ' ⚠️'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={getPriorityColor(task.priority)} variant="secondary">
          {task.priority}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={getCategoryColor(task.category)} variant="secondary">
          {task.category}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </td>
    </tr>
  );
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Fetch all tasks from API
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // Update filter counts
  const filterCounts = useMemo(() => {
    return {
      status: {
        all: allTasks.length,
        pending: allTasks.filter(t => !t.completed).length,
        completed: allTasks.filter(t => t.completed).length,
      },
      priority: {
        all: allTasks.length,
        CRITICAL: allTasks.filter(t => t.priority === 'CRITICAL').length,
        HIGH: allTasks.filter(t => t.priority === 'HIGH').length,
        MEDIUM: allTasks.filter(t => t.priority === 'MEDIUM').length,
        LOW: allTasks.filter(t => t.priority === 'LOW').length,
      },
      category: {
        all: allTasks.length,
        IT: allTasks.filter(t => t.category === 'IT').length,
        FACILITIES: allTasks.filter(t => t.category === 'FACILITIES').length,
        HR: allTasks.filter(t => t.category === 'HR').length,
        SECURITY: allTasks.filter(t => t.category === 'SECURITY').length,
        MANAGER: allTasks.filter(t => t.category === 'MANAGER').length,
        COMPLIANCE: allTasks.filter(t => t.category === 'COMPLIANCE').length,
        TRAINING: allTasks.filter(t => t.category === 'TRAINING').length,
      },
    };
  }, []);

  // Filter and paginate tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    // Apply search
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search) ||
        task.assignedTo.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task =>
        statusFilter === 'completed' ? task.completed : !task.completed
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    return filtered;
  }, [allTasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Paginate
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const tasksData = await response.json();
          setAllTasks(tasksData);
          setTasks(tasksData);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = { ...task, completed: !task.completed };
      if (updatedTask.completed) {
        updatedTask.completedAt = new Date();
      } else {
        updatedTask.completedAt = undefined;
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Update local state
        setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleViewHire = (hireId: string) => {
    window.open(`/dashboard/hires/${hireId}`, '_blank');
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === paginatedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(paginatedTasks.map(task => task.id));
    }
  };

  const handleBulkComplete = async () => {
    try {
      // Update each task individually (in a real app, you might have a bulk update endpoint)
      const updatePromises = selectedTasks.map(async (taskId) => {
        const task = allTasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedTask = { ...task, completed: true, completedAt: new Date() };

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });

        return response.ok;
      });

      await Promise.all(updatePromises);

      // Update local state
      setAllTasks(prev => prev.map(t =>
        selectedTasks.includes(t.id)
          ? { ...t, completed: true, completedAt: new Date() }
          : t
      ));

      setSelectedTasks([]);
      setShowBulkModal(false);
    } catch (error) {
      console.error('Error bulk completing tasks:', error);
    }
  };

  const statusFiltersWithCounts = statusFilterOptions.map(filter => ({
    ...filter,
    count: filterCounts.status[filter.id as keyof typeof filterCounts.status] || 0,
  }));

  const priorityFiltersWithCounts = priorityFilterOptions.map(filter => ({
    ...filter,
    count: filterCounts.priority[filter.id as keyof typeof filterCounts.priority] || 0,
  }));

  const categoryFiltersWithCounts = categoryFilterOptions.map(filter => ({
    ...filter,
    count: filterCounts.category[filter.id as keyof typeof filterCounts.category] || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage all onboarding tasks across your organization</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks by title, description, or assignee..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterButtons
              filters={statusFiltersWithCounts}
              activeFilter={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterButtons
              filters={priorityFiltersWithCounts}
              activeFilter={priorityFilter}
              onChange={setPriorityFilter}
            />
            <FilterButtons
              filters={categoryFiltersWithCounts}
              activeFilter={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowBulkModal(true)}>
                Mark Complete
              </Button>
              <Button variant="outline" size="sm">
                Reassign
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tasks Table */}
      <Card>
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedTasks.length === paginatedTasks.length && paginatedTasks.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onViewHire={handleViewHire}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredTasks.length}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Bulk Complete Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Mark Tasks as Complete"
        description={`Are you sure you want to mark ${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} as complete?`}
      >
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowBulkModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleBulkComplete}>
            Mark Complete
          </Button>
        </div>
      </Modal>
    </div>
  );
}