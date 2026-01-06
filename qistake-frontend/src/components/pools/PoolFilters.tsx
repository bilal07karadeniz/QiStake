'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { PoolFilter } from '@/types';
import { cn } from '@/lib/utils';

interface PoolFiltersProps {
  filter: PoolFilter;
  onFilterChange: (filter: PoolFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const filterOptions: { value: PoolFilter; label: string }[] = [
  { value: 'all', label: 'All Pools' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
];

export function PoolFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: PoolFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-background-secondary rounded-xl">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              filter === option.value
                ? 'bg-primary text-white shadow-glow-purple'
                : 'text-text-secondary hover:text-white hover:bg-background-tertiary'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by token name or address..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-background-secondary border border-border rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
