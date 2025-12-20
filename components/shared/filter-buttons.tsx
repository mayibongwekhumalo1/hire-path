"use client";

import { FilterButtonsProps } from '@/types/hire.types';
import { cn } from '@/lib/utils/string.utils';

export function FilterButtons({
  filters,
  activeFilter,
  onChange,
  className,
}: FilterButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={cn(
              "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            )}
            aria-pressed={isActive}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  isActive
                    ? "bg-emerald-200 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}