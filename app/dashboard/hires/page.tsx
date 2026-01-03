"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/shared/search-bar';
import { FilterButtons } from '@/components/shared/filter-buttons';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TableSkeleton } from '@/components/ui/skeleton';
import { NoHiresEmptyState, NoSearchResultsEmptyState } from '@/components/shared/EmptyState';
import { Hire, FilterOption } from '@/types/hire.types';
import { formatDate, getInitials } from '@/lib/utils/string.utils';

const ITEMS_PER_PAGE = 10;

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'COMPLETED', label: 'Completed' },
];

function HireTableRow({
  hire,
  isSelected,
  onSelect,
  onViewDetails
}: {
  hire: Hire;
  isSelected: boolean;
  onSelect: (hireId: string) => void;
  onViewDetails: (hireId: string) => void;
}) {
  const getStatusColor = (status: Hire['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 ">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(hire.id)}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap ">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">
                {getInitials(`${hire.firstName} ${hire.lastName}`)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {hire.firstName} {hire.lastName}
            </div>
            <div className="text-sm text-gray-500">{hire.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{hire.department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{hire.jobTitle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(hire.startDate)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hire.status)}`}>
          {hire.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetails(hire.id)}
          className="text-emerald-600 hover:text-emerald-900"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}

export default function HiresPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHires, setSelectedHires] = useState<string[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allHires, setAllHires] = useState<Hire[]>([]);

  // Update filter counts based on current data
  const filtersWithCounts = useMemo(() => {
    const counts = {
      all: allHires.length,
      PENDING: allHires.filter((h: Hire) => h.status === 'PENDING').length,
      ACTIVE: allHires.filter((h: Hire) => h.status === 'ACTIVE').length,
      COMPLETED: allHires.filter((h: Hire) => h.status === 'COMPLETED').length,
    };

    return filterOptions.map(filter => ({
      ...filter,
      count: counts[filter.id as keyof typeof counts] || 0,
    }));
  }, [allHires]);

  // Load all hires for filter counts
  useEffect(() => {
    const loadAllHires = async () => {
      try {
        const response = await fetch('/api/hires?page=1&pageSize=1000'); // Large page size to get all
        const data = await response.json();
        setAllHires(data.hires || []);
      } catch (error) {
        console.error('Error loading all hires:', error);
      }
    };

    loadAllHires();
  }, []);

  // Load hires data
  useEffect(() => {
    const loadHires = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: ITEMS_PER_PAGE.toString(),
        });

        if (activeFilter !== 'all') {
          params.append('status', activeFilter);
        }

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(`/api/hires?${params}`);
        const data = await response.json();

        setHires(data.hires || []);
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error('Error loading hires:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHires();
  }, [searchQuery, activeFilter, currentPage]);

  const handleSelectHire = (hireId: string) => {
    setSelectedHires(prev =>
      prev.includes(hireId)
        ? prev.filter(id => id !== hireId)
        : [...prev, hireId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHires.length === hires.length) {
      setSelectedHires([]);
    } else {
      setSelectedHires(hires.map(hire => hire.id));
    }
  };

  const handleViewDetails = (hireId: string) => {
    router.push(`/dashboard/hires/${hireId}`);
  };

  const handleBulkExport = () => {
    // Mock export functionality
    console.log('Exporting hires:', selectedHires);
    alert(`Exporting ${selectedHires.length} hires...`);
  };

  const handleBulkSendReminders = () => {
    // Mock send reminders functionality
    console.log('Sending reminders to:', selectedHires);
    alert(`Sending reminders to ${selectedHires.length} hires...`);
  };

  const handleAddNewHire = () => {
    router.push('/dashboard/hires/new');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const hasFilters = searchQuery || activeFilter !== 'all';
  const hasResults = hires.length > 0;
  const showNoResults = hasFilters && !hasResults && !loading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hires</h1>
          <p className="text-gray-600">Manage your employee onboarding process</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, or department..."
            />
          </div>
          <FilterButtons
            filters={filtersWithCounts}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedHires.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedHires.length} hire{selectedHires.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleBulkExport}>
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkSendReminders}>
                Send Reminders
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        {loading ? (
          <TableSkeleton />
        ) : showNoResults ? (
          <div className="p-8">
            <NoSearchResultsEmptyState
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
            />
          </div>
        ) : !hasResults ? (
          <div className="p-8">
            <NoHiresEmptyState onAddHire={handleAddNewHire} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedHires.length === hires.length && hires.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hires.map((hire) => (
                    <HireTableRow
                      key={hire.id}
                      hire={hire}
                      isSelected={selectedHires.includes(hire.id)}
                      onSelect={handleSelectHire}
                      onViewDetails={handleViewDetails}
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
                  totalItems={totalItems}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleAddNewHire}
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>
    </div>
  );
}