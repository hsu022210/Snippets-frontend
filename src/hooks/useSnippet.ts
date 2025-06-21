import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiRequest } from './useApiRequest'
import { useToast } from '../contexts/ToastContext'
import { ApiError } from '../services'
import { Snippet, SnippetData } from '../types'
import { snippetService } from '../services'

export const useSnippet = (snippetId: number) => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCode, setEditedCode] = useState<string>('');
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedLanguage, setEditedLanguage] = useState<string>('');
  const navigate = useNavigate();
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  const fetchSnippet = useCallback(async () => {
    try {
      const snippetData = await makeRequest(
        () => snippetService.getSnippet(snippetId)
      );
      setSnippet(snippetData);
      setEditedCode(snippetData.code);
      setEditedTitle(snippetData.title);
      setEditedLanguage(snippetData.language);
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'Failed to fetch snippet', 'danger');
      console.error('Error fetching snippet:', error);
    } finally {
      setLoading(false);
    }
  }, [snippetId, makeRequest, showToast]);

  useEffect(() => {
    fetchSnippet();
  }, [fetchSnippet]);

  const handleSave = async () => {
    setSaving(true);
    
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
      showToast('Snippet saved successfully!', 'primary', 3);
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'Failed to save', 'danger');
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
      showToast('Snippet deleted successfully!', 'primary', 3);
      navigate('/snippets');
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'Failed to delete snippet', 'danger');
      console.error('Error deleting snippet:', error);
    }
  };

  const handleCancel = () => {
    if (snippet) {
      setIsEditing(false);
      setEditedCode(snippet.code);
      setEditedTitle(snippet.title);
      setEditedLanguage(snippet.language);
    }
  };

  return {
    snippet,
    loading,
    saving,
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
  const navigate = useNavigate();
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  const createSnippet = async (snippetData: SnippetData) => {
    setLoading(true);

    try {
      const newSnippet = await makeRequest(
        () => snippetService.createSnippet(snippetData)
      );
      showToast('Snippet created successfully!', 'primary', 3);
      navigate(`/snippets/${newSnippet.id}`);
      return newSnippet;
    } catch (error) {
      const apiError = error as ApiError;
      showToast(apiError.message || 'Failed to create snippet', 'danger');
      console.error('Error creating snippet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSnippet,
    loading
  };
}; 