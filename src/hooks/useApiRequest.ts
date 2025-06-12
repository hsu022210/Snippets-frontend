import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { AxiosResponse } from 'axios';

type ApiCall<T = any> = () => Promise<AxiosResponse<T>>;

interface UseApiRequestReturn {
  makeRequest: <T = any>(apiCall: ApiCall<T>, loadingMessage?: string) => Promise<AxiosResponse<T>>;
}

export const useApiRequest = (): UseApiRequestReturn => {
  const { showToast, hideToast } = useToast();

  const makeRequest = useCallback(async <T = any>(
    apiCall: ApiCall<T>,
    loadingMessage?: string
  ): Promise<AxiosResponse<T>> => {
    let timeoutId: NodeJS.Timeout | undefined;
    
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