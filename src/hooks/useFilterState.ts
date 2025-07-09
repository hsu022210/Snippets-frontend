import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SnippetFilterValues } from '../types';
import { filtersToURLParams, urlParamsToFilters } from '../utils/paramMapping';

export const useFilterState = (initialFilters: SnippetFilterValues) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params only
  const [filters, setFilters] = useState<SnippetFilterValues>(() => {
    return getFiltersFromURL(searchParams) || initialFilters;
  });

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = filtersToURLParams(filters as unknown as Record<string, string>);
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilters = (newFilters: Partial<SnippetFilterValues>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilters,
    resetFilters
  };
};

// Helper function to extract filters from URL search params
function getFiltersFromURL(searchParams: URLSearchParams): SnippetFilterValues {
  const urlFilters = urlParamsToFilters(searchParams);
  return {
    language: urlFilters.language || '',
    createdAfter: urlFilters.createdAfter || '',
    createdBefore: urlFilters.createdBefore || '',
    searchTitle: urlFilters.searchTitle || '',
    searchCode: urlFilters.searchCode || '',
    page: urlFilters.page || '',
  };
} 