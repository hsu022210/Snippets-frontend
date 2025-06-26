import { useState, useEffect } from 'react';
import { SnippetFilterValues } from '../types';

const STORAGE_KEY = 'snippet_filters';

export const useFilterState = (initialFilters: SnippetFilterValues) => {
  const [filters, setFilters] = useState<SnippetFilterValues>(() => {
    const storedFilters = localStorage.getItem(STORAGE_KEY);
    return storedFilters ? JSON.parse(storedFilters) : initialFilters;
  });

  useEffect(() => {
    if (Object.values(filters).every(value => value === '')) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters]);

  const updateFilters = (newFilters: Partial<SnippetFilterValues>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    filters,
    updateFilters,
    resetFilters
  };
}; 