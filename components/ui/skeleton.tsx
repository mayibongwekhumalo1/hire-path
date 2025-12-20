"use client";

import { SkeletonProps } from '@/types/hire.types';
import { cn } from '@/lib/utils/string.utils';

export function Skeleton({
  variant = 'text',
  lines = 1,
  className,
}: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200", className)}>
        <div className="animate-pulse">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-gray-200 px-6 py-4 last:border-b-0">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  // Default text skeleton
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-gray-200 rounded",
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Specific skeleton components for common use cases
export function CardSkeleton({ className }: { className?: string }) {
  return <Skeleton variant="card" className={className} />;
}

export function TableSkeleton({ className }: { className?: string }) {
  return <Skeleton variant="table" className={className} />;
}

export function TextSkeleton({ lines = 1, className }: { lines?: number; className?: string }) {
  return <Skeleton variant="text" lines={lines} className={className} />;
}

export function AvatarSkeleton({ className }: { className?: string }) {
  return <Skeleton variant="avatar" className={className} />;
}

// Dashboard-specific skeletons
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

export function RecentHiresSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200", className)}>
      <div className="animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}