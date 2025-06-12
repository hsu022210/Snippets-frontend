import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApiRequest } from './useApiRequest';
import { AxiosError } from 'axios';

interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  created_at: string;
  updated_at: string;
  user: number;
}

interface ApiErrorResponse {
  detail?: string;
}

interface SnippetData {
  title: string;
  code: string;
  language: string;
}

export const useSnippet = (snippetId: number) => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCode, setEditedCode] = useState<string>('');
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedLanguage, setEditedLanguage] = useState<string>('');
  const navigate = useNavigate();
  const { api } = useAuth();
  const { makeRequest } = useApiRequest();

  const fetchSnippet = useCallback(async () => {
    try {
      const response = await makeRequest(
        () => api.get(`/snippets/${snippetId}/`)
      );
      setSnippet(response.data);
      setEditedCode(response.data.code);
      setEditedTitle(response.data.title);
      setEditedLanguage(response.data.language);
      setError('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(axiosError.response?.data?.detail || 'Failed to fetch snippet');
      }
      console.error('Error fetching snippet:', error);
    } finally {
      setLoading(false);
    }
  }, [api, snippetId, navigate, makeRequest]);

  useEffect(() => {
    fetchSnippet();
  }, [fetchSnippet]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    
    try {
      const response = await makeRequest(
        () => api.patch(`/snippets/${snippetId}/`, {
          code: editedCode,
          title: editedTitle,
          language: editedLanguage
        })
      );
      setSnippet(response.data);
      setIsEditing(false);
      setSaveError('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        setSaveError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setSaveError(axiosError.response?.data?.detail || 'Failed to save');
      }
      console.error('Error saving snippet:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await makeRequest(
        () => api.delete(`/snippets/${snippetId}/`)
      );
      navigate('/snippets');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(axiosError.response?.data?.detail || 'Failed to delete snippet');
      }
      console.error('Error deleting snippet:', error);
    }
  };

  const handleCancel = () => {
    if (snippet) {
      setIsEditing(false);
      setEditedCode(snippet.code);
      setEditedTitle(snippet.title);
      setEditedLanguage(snippet.language);
      setSaveError('');
    }
  };

  return {
    snippet,
    loading,
    error,
    saving,
    saveError,
    isEditing,
    editedCode,
    editedTitle,
    editedLanguage,
    setIsEditing,
    setEditedCode,
    setEditedTitle,
    setEditedLanguage,
    handleSave,
    handleDelete,
    handleCancel
  };
};

export const useCreateSnippet = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { api } = useAuth();
  const { makeRequest } = useApiRequest();

  const createSnippet = async (snippetData: SnippetData) => {
    setError('');
    setLoading(true);

    try {
      const response = await makeRequest(
        () => api.post('/snippets/', snippetData)
      );
      navigate(`/snippets/${response.data.id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(axiosError.response?.data?.detail || 'Failed to create snippet');
      }
      console.error('Error creating snippet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSnippet,
    loading,
    error
  };
}; 