import { useState, useEffect, useCallback } from 'react'
import { useApiRequest } from './useApiRequest'
import { Snippet, SnippetListResponse, FilterOptions } from '../types'
import { getPageSize } from '../utils/pagination'
import { snippetService } from '../services'

export const useSnippetList = (filters?: FilterOptions, page: number = 1) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const { makeRequest } = useApiRequest();

  const fetchSnippets = useCallback(async () => {
    try {
      const snippetFilters = {
        ...filters,
        page,
        page_size: getPageSize()
      };

      const response = await makeRequest<SnippetListResponse>(
        () => snippetService.getSnippets(snippetFilters)
      );
      setSnippets(response.results);
      setTotalCount(response.count);
      setHasNextPage(!!response.next);
      setHasPreviousPage(!!response.previous);
      setError('');
    } catch (error) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  }, [makeRequest, filters, page]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return {
    snippets,
    totalCount,
    loading,
    error,
    hasNextPage,
    hasPreviousPage
  };
}; 