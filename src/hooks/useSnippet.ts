import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiRequest } from './useApiRequest'
import { ApiError } from '../services'
import { Snippet, SnippetData } from '../types'
import { snippetService } from '../services'

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
  const { makeRequest } = useApiRequest();

  const fetchSnippet = useCallback(async () => {
    try {
      const snippetData = await makeRequest(
        () => snippetService.getSnippet(snippetId)
      );
      setSnippet(snippetData);
      setEditedCode(snippetData.code);
      setEditedTitle(snippetData.title);
      setEditedLanguage(snippetData.language);
      setError('');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(apiError.message || 'Failed to fetch snippet');
      }
      console.error('Error fetching snippet:', error);
    } finally {
      setLoading(false);
    }
  }, [snippetId, navigate, makeRequest]);

  useEffect(() => {
    fetchSnippet();
  }, [fetchSnippet]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    
    try {
      const updatedSnippet = await makeRequest(
        () => snippetService.updateSnippet(snippetId, {
          code: editedCode,
          title: editedTitle,
          language: editedLanguage
        })
      );
      setSnippet(updatedSnippet);
      setIsEditing(false);
      setSaveError('');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setSaveError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setSaveError(apiError.message || 'Failed to save');
      }
      console.error('Error saving snippet:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await makeRequest(
        () => snippetService.deleteSnippet(snippetId)
      );
      navigate('/snippets');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(apiError.message || 'Failed to delete snippet');
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
  const { makeRequest } = useApiRequest();

  const createSnippet = async (snippetData: SnippetData) => {
    setError('');
    setLoading(true);

    try {
      const newSnippet = await makeRequest(
        () => snippetService.createSnippet(snippetData)
      );
      navigate(`/snippets/${newSnippet.id}`);
      return newSnippet;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(apiError.message || 'Failed to create snippet');
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