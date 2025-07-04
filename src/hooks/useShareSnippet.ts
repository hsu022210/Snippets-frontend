import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

export const useShareSnippet = () => {
  const { showToast } = useToast();
  const [shareSnippetTooltip, setShareSnippetTooltip] = useState<string>('Share snippet');

  const handleShare = async (snippetId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/snippets/${snippetId}`);
      showToast('Link copied to clipboard!', undefined, 2);
      setShareSnippetTooltip('Link copied!');
      
      // Use a separate timeout to reset the tooltip
      const timeoutId = setTimeout(() => {
        setShareSnippetTooltip('Share snippet');
      }, 2000);

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('Failed to copy link', 'danger');
      setShareSnippetTooltip('Failed to copy link');
    }
  };

  return {
    shareSnippetTooltip,
    handleShare
  };
}; 