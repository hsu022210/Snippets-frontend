import { AxiosResponse } from 'axios';

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ApiRegisterErrorResponse {
  detail: {
    email?: string | string[];
    username?: string | string[];
    password?: string | string[];
    password2?: string | string[];
    detail?: string;
  };
}

export type ApiCall<T = any> = () => Promise<AxiosResponse<T>>;

export interface UseApiRequestReturn {
  makeRequest: <T = any>(apiCall: ApiCall<T>, loadingMessage?: string) => Promise<AxiosResponse<T>>;
} 