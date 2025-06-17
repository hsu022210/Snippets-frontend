import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApiRequest } from './useApiRequest'
import { Snippet, SnippetListResponse, FilterOptions } from '../types/interfaces'

export const useSnippetList = (filters?: FilterOptions) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
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

      const response = await makeRequest<SnippetListResponse>(
        () => api.get(`/snippets/?${params.toString()}`)
      );
      setSnippets(response.data.results);
      setTotalCount(response.data.count);
      setError('');
    } catch (error) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  }, [api, makeRequest, filters]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return {
    snippets,
    totalCount,
    loading,
    error
  };
}; 