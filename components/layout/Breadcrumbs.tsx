"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdChevronRight, MdHome } from 'react-icons/md';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Dashboard', href: '/dashboard' }
  ];

  let currentPath = '/dashboard';

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Convert segment to readable name
    let name = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Handle special cases
    if (segment === 'hires') name = 'Hires';
    else if (segment === 'tasks') name = 'Tasks';
    else if (segment === 'reports') name = 'Reports';
    else if (segment === 'new') name = 'New';
    else if (segment === 'edit') name = 'Edit';
    else if (!isNaN(Number(segment))) {
      // If it's a number (ID), get the previous segment for context
      const prevSegment = segments[i - 1];
      if (prevSegment === 'hires') name = 'Hire Details';
      else if (prevSegment === 'tasks') name = 'Task Details';
      else name = 'Details';
    }

    breadcrumbs.push({
      name,
      href: currentPath,
      current: i === segments.length - 1
    });
  }

  return breadcrumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on the main dashboard page
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-500 flex items-center"
          >
            <MdHome className="h-4 w-4 mr-1" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {breadcrumbs.slice(1).map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <MdChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            {breadcrumb.current ? (
              <span className="text-sm font-medium text-gray-900">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}