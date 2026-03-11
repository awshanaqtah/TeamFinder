import React, { useState } from 'react';
import { Major, FilterOptions } from '../types';

interface TeammateFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const TeammateFilters: React.FC<TeammateFiltersProps> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = Object.keys(filters).filter(key => filters[key as keyof FilterOptions] !== undefined).length;

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="space-y-3 animate-fade-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-4 text-sky-400 text-sm hover:text-sky-300 flex items-center gap-2 transition"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Filters {hasActiveFilters && `(${activeFilterCount})`}
      </button>

      {isExpanded && (
        <div className="bg-slate-700/50 p-4 rounded-lg mb-4 space-y-4 animate-slide-in-up">
          <div>
            <label className="text-sm text-slate-300 mb-1 block">Major</label>
            <select
              value={filters.major || ''}
              onChange={(e) => handleFilterChange('major', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-2 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            >
              <option value="">All Majors</option>
              {Object.values(Major).map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-600">
              {filters.major && (
                <div className="bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-full border border-sky-500/30 flex items-center gap-2">
                  Major: {filters.major}
                  <button
                    type="button"
                    onClick={() => clearFilter('major')}
                    className="hover:text-white transition"
                  >
                    ×
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeammateFilters;