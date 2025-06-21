import { useState, useEffect, useCallback } from 'react'
import { useApiRequest } from './useApiRequest'
import { useToast } from '../contexts/ToastContext'
import { Snippet, SnippetListResponse, FilterOptions } from '../types'
import { getPageSize } from '../utils/pagination'
import { snippetService } from '../services'

export const useSnippetList = (filters?: FilterOptions, page: number = 1) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

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
    } catch (error) {
      showToast('Failed to fetch snippets', 'danger');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  }, [makeRequest, filters, page, showToast]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return {
    snippets,
    totalCount,
    loading,
    hasNextPage,
    hasPreviousPage
  };
}; 