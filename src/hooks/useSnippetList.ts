import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApiRequest } from './useApiRequest';
import { Snippet, SnippetListResponse } from '../types/interfaces'

export const useSnippetList = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { api } = useAuth();
  const { makeRequest } = useApiRequest();

  const fetchSnippets = useCallback(async () => {
    try {
      const response = await makeRequest<SnippetListResponse>(
        () => api.get('/snippets/')
      );
      setSnippets(response.data.results);
      setError('');
    } catch (error) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  }, [api, makeRequest]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return {
    snippets,
    loading,
    error
  };
}; 