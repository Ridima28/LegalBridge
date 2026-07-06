import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { dummyLawyers } from '../lib/dummy-data';
import LawyerCard from '../components/lawyer/LawyerCard';
import { Search, X, SlidersHorizontal, Scale } from 'lucide-react';
import { CASE_TYPES, INDIAN_STATES, COURT_TYPES } from '../types';

export default function LawyersListPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState({
    specialization: '',
    state: '',
    courtType: '',
    minExperience: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Use dummy data
  const lawyers = dummyLawyers;
  const isLoading = false;

  const clearFilters = () => {
    setFilters({
      specialization: '',
      state: '',
      courtType: '',
      minExperience: '',
    });
    setSearchQuery('');
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = lawyer.profiles.full_name?.toLowerCase().includes(query);
      const matchesSpec = lawyer.specialization?.some(s => s.toLowerCase().includes(query));
      if (!matchesName && !matchesSpec) return false;
    }

    if (filters.specialization && !lawyer.specialization.includes(filters.specialization)) {
      return false;
    }

    if (filters.state && lawyer.profiles.state !== filters.state) {
      return false;
    }

    if (filters.courtType && !lawyer.courts_served.includes(filters.courtType)) {
      return false;
    }

    if (filters.minExperience && lawyer.years_experience < parseInt(filters.minExperience)) {
      return false;
    }

    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
            Find Lawyers
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-2">
            Browse verified lawyers and find the perfect match for your legal needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card dark:bg-secondary-900 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or specialization..."
                className="input pl-12 dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} gap-2 relative`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-down">
              <div>
                <label className="label dark:text-secondary-300">Specialization</label>
                <select
                  value={filters.specialization}
                  onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                  className="select dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {CASE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label dark:text-secondary-300">Location</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="select dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label dark:text-secondary-300">Court Experience</label>
                <select
                  value={filters.courtType}
                  onChange={(e) => setFilters({ ...filters, courtType: e.target.value })}
                  className="select dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
                >
                  <option value="">All Courts</option>
                  {COURT_TYPES.map((court) => (
                    <option key={court} value={court}>{court}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label dark:text-secondary-300">Min. Experience</label>
                <select
                  value={filters.minExperience}
                  onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                  className="select dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
                >
                  <option value="">Any Experience</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                  <option value="15">15+ years</option>
                  <option value="20">20+ years</option>
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost btn-sm text-error-600"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {filteredLawyers.length === 0 ? (
          <div className="card dark:bg-secondary-900 p-12 text-center">
            <Scale className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              No Lawyers Found
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 mb-4">
              Try adjusting your search criteria or clear filters to see more results.
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
              Showing {filteredLawyers.length} verified lawyers
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
