"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { canCreateHires, canViewReports, canManageTasks } from '@/lib/permissions';

const navigation = [
  { name: 'Hires', href: '/dashboard/hires', icon: '👥' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: '📋' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📊' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user || null;

  const filteredNavigation = navigation.filter((item) => {
    if (item.href === '/dashboard/hires') {
      return canCreateHires(user) || canViewReports(user);
    }
    if (item.href === '/dashboard/tasks') {
      return canManageTasks(user);
    }
    if (item.href === '/dashboard/reports') {
      return canViewReports(user);
    }
    return true;
  });

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">HirePath</h2>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {filteredNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}