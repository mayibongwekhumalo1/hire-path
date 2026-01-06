"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/string.utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Specific empty states for common scenarios
export function NoHiresEmptyState({ onAddHire }: { onAddHire: () => void }) {
  return (
    <EmptyState
      title="No hires yet"
      description="Get started by adding your first new hire to the onboarding system."
      icon={
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      }
      action={{
        label: "Add New Hire",
        onClick: onAddHire,
      }}
    />
  );
}

export function NoSearchResultsEmptyState({
  searchQuery,
  onClearSearch
}: {
  searchQuery: string;
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      title="No results found"
      description={`No hires match "${searchQuery}". Try adjusting your search terms.`}
      icon={
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: 'outline',
      }}
    />
  );
}

export function NoTasksEmptyState({ hireName }: { hireName: string }) {
  return (
    <EmptyState
      title="No tasks yet"
      description={`Tasks for ${hireName} will appear here once they're created.`}
      icon={
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
    />
  );
}