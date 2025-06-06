import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export const useApiRequest = () => {
  const { showToast, hideToast } = useToast();

  const makeRequest = useCallback(async (apiCall, loadingMessage) => {
    let timeoutId;
    
    try {
      // Show loading toast after 3 seconds
      timeoutId = setTimeout(() => {
        showToast(loadingMessage);
      }, 3000);

      const response = await apiCall();
      return response;
    } finally {
      clearTimeout(timeoutId);
      hideToast();
    }
  }, [showToast, hideToast]);

  return { makeRequest };
}; 
