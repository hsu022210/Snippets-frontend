import { useCallback } from 'react'
import { useToast } from '../contexts/ToastContext'
import { ApiError } from '../services'

// Updated type for the new service layer
export type ServiceCall<T = any> = () => Promise<T>;

export interface UseApiRequestReturn {
  makeRequest: <T = any>(serviceCall: ServiceCall<T>, loadingMessage?: string) => Promise<T>;
}

export const useApiRequest = (): UseApiRequestReturn => {
  const { showToast, hideToast } = useToast();

  const makeRequest = useCallback(async <T = any>(
    serviceCall: ServiceCall<T>,
    loadingMessage: string = 'The site may be slow to respond after a certain time of inactivity at first, please wait for a minute to refresh the page if needed.'
  ): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    try {
      // Show loading toast after 3 seconds if loadingMessage is provided
      if (loadingMessage) {
        timeoutId = setTimeout(() => {
          showToast(loadingMessage);
        }, 3000);
      }

      const response = await serviceCall();
      return response;
    } catch (error) {
      // Re-throw ApiError instances as-is
      if (error instanceof ApiError) {
        throw error;
      }
      // Convert other errors to ApiError
      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        0,
        null,
        false
      );
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      hideToast();
    }
  }, [showToast, hideToast]);

  return { makeRequest };
}; 