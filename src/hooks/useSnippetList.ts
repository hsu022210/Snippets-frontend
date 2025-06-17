import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApiRequest } from './useApiRequest'
import { Snippet, SnippetListResponse, FilterOptions } from '../types/interfaces'

export const useSnippetList = (filters?: FilterOptions, page: number = 1) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const { api } = useAuth();
  const { makeRequest } = useApiRequest();

  const fetchSnippets = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters?.language) {
        params.append('language', filters.language);
      }
      if (filters?.createdAfter) {
        params.append('created_after', filters.createdAfter);
      }
      if (filters?.createdBefore) {
        params.append('created_before', filters.createdBefore);
      }
      if (filters?.searchTitle) {
        params.append('search_title', filters.searchTitle);
      }
      if (filters?.searchCode) {
        params.append('search_code', filters.searchCode);
      }
      // Add pagination parameters
      params.append('page', page.toString());
      params.append('page_size', '6'); // Request 6 snippets per page

      const response = await makeRequest<SnippetListResponse>(
        () => api.get(`/snippets/?${params.toString()}`)
      );
      setSnippets(response.data.results);
      setTotalCount(response.data.count);
      setHasNextPage(!!response.data.next);
      setHasPreviousPage(!!response.data.previous);
      setError('');
    } catch (error) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  }, [api, makeRequest, filters, page]);

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