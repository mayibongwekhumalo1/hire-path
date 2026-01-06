"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { MdSearch, MdAdd, MdAssignment, MdPeople } from 'react-icons/md';

interface User {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  role?: string;
}

interface HeaderProps {
  user: User;
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 1 && segments[0] === 'dashboard') {
    return 'Dashboard Overview';
  }

  if (segments.length >= 2) {
    const section = segments[1];
    const action = segments[2];

    switch (section) {
      case 'hires':
        if (action === 'new') return 'Add New Hire';
        if (action === 'edit') return 'Edit Hire';
        if (!isNaN(Number(action))) return 'Hire Details';
        return 'Hires Management';
      case 'tasks':
        if (action === 'new') return 'Create Task';
        if (action === 'edit') return 'Edit Task';
        if (!isNaN(Number(action))) return 'Task Details';
        return 'Tasks Management';
      case 'reports':
        return 'Reports & Analytics';
      default:
        return 'Dashboard';
    }
  }

  return 'Dashboard';
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      // For now, redirect to hires page with search query
      // In a real app, this would search across all entities
      router.push(`/dashboard/hires?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/hires/new')}
              title="Add New Hire (Ctrl+N)"
              className="flex items-center space-x-1"
            >
              <MdAdd className="h-4 w-4" />
              <span className="hidden sm:inline">New Hire</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/tasks/new')}
              title="Create Task"
              className="flex items-center space-x-1"
            >
              <MdAssignment className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>

          {/* Global Search */}
          <form onSubmit={handleGlobalSearch} className="relative">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search everything... (Ctrl+K)"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </form>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-700">
              Welcome, {user.name || user.email}
            </div>
            {user.role && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}