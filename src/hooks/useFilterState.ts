import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SnippetFilterValues } from '../types';

// URL parameter mapping
const URL_PARAMS = {
  language: 'lang',
  createdAfter: 'after',
  createdBefore: 'before',
  searchTitle: 'title',
  searchCode: 'code',
  page: 'page'
} as const;

export const useFilterState = (initialFilters: SnippetFilterValues) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params only
  const [filters, setFilters] = useState<SnippetFilterValues>(() => {
    return getFiltersFromURL(searchParams) || initialFilters;
  });

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    // Add non-empty filter values to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        const urlParam = URL_PARAMS[key as keyof typeof URL_PARAMS];
        if (urlParam) {
          newSearchParams.set(urlParam, value);
        }
      }
    });

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
  return {
    language: searchParams.get(URL_PARAMS.language) || '',
    createdAfter: searchParams.get(URL_PARAMS.createdAfter) || '',
    createdBefore: searchParams.get(URL_PARAMS.createdBefore) || '',
    searchTitle: searchParams.get(URL_PARAMS.searchTitle) || '',
    searchCode: searchParams.get(URL_PARAMS.searchCode) || '',
  };
} 