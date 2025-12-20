"use client";

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { DatePickerProps } from '@/types/hire.types';
import { cn } from '@/lib/utils/string.utils';

export function DatePicker({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = "Select a date",
  disabled = false,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = `date-picker-${name}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'PPP'); // e.g., "December 19th, 2023"
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative" ref={containerRef}>
        <button
          id={inputId}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm",
            error
              ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300",
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            !value && "text-gray-400"
          )}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
        >
          <span className="block truncate">
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={[
                { before: minDate },
                { after: maxDate }
              ].filter(Boolean)}
              className="text-sm"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-emerald-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md",
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700 focus:bg-emerald-700",
                day_today: "bg-gray-100 text-gray-900",
                day_outside: "text-gray-300 opacity-50",
                day_disabled: "text-gray-300 opacity-50",
                day_range_middle: "aria-selected:bg-emerald-100 aria-selected:text-emerald-900",
                day_hidden: "invisible",
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}