import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { AxiosResponse } from 'axios';
import { ApiCall, UseApiRequestReturn } from '../types/interfaces';

export const useApiRequest = (): UseApiRequestReturn => {
  const { showToast, hideToast } = useToast();

  const makeRequest = useCallback(async <T = any>(
    apiCall: ApiCall<T>,
    loadingMessage: string = 'The site may be slow to respond after a certain time of inactivity.'
  ): Promise<AxiosResponse<T>> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    try {
      // Show loading toast after 3 seconds if loadingMessage is provided
      if (loadingMessage) {
        timeoutId = setTimeout(() => {
          showToast(loadingMessage);
        }, 3000);
      }

      const response = await apiCall();
      return response;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      hideToast();
    }
  }, [showToast, hideToast]);

  return { makeRequest };
}; 