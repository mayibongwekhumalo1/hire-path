"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/string.utils';
import { MdMenu, MdClose } from 'react-icons/md';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠', shortcut: 'Ctrl+D / Alt+1' },
  { name: 'Hires', href: '/dashboard/hires', icon: '👥', shortcut: 'Ctrl+H / Alt+2' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: '📋', shortcut: 'Ctrl+T / Alt+3' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📊', shortcut: 'Ctrl+R / Alt+4' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-gray-800 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        {!isCollapsed && (
          <h1 className="text-white text-xl font-bold">HirePath</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-700 p-2 rounded-md transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <MdMenu className="h-5 w-5" /> : <MdClose className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
              title={isCollapsed ? `${item.name} (${item.shortcut})` : item.shortcut}
            >
              <span className={cn("flex-shrink-0", isCollapsed ? "mx-auto" : "mr-3")}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}