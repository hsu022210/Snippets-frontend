import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '../types';

// Environment configuration
const isDevelopment = import.meta.env.MODE === 'development';
const BASE_URL = isDevelopment ? 'http://localhost:8000' : import.meta.env.VITE_API_BASE_URL_DEPLOY;

// Token management
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

class TokenStorage {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

// API Error class for better error handling
export class ApiError extends Error {
  public status: number;
  public data: any;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 0, data: any = null, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }

  static fromAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
    if (error.message === 'Network Error') {
      return new ApiError(
        'Unable to connect to the server. Please check your internet connection.',
        0,
        null,
        true
      );
    }

    const status = error.response?.status || 0;
    const data = error.response?.data;
    const message = data?.detail || data?.message || error.message || 'An unexpected error occurred';

    return new ApiError(message, status, data, false);
  }
}

// API Client class
export class ApiClient {
  private instance: AxiosInstance;
  private tokenStorage: TokenStorage;
  private onTokenRefresh?: (access: string, refresh: string) => void;
  private onLogout?: () => void;

  constructor() {
    this.tokenStorage = new TokenStorage();
    this.instance = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.tokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.tokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken
            });

            const { access } = response.data;
            this.tokenStorage.setTokens(access, refreshToken);
            
            if (this.onTokenRefresh) {
              this.onTokenRefresh(access, refreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`;
            }
            return instance(originalRequest);
          } catch (refreshError) {
            this.tokenStorage.clearTokens();
            if (this.onLogout) {
              this.onLogout();
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }

  // Set callbacks for token refresh and logout
  setCallbacks(onTokenRefresh?: (access: string, refresh: string) => void, onLogout?: () => void) {
    this.onTokenRefresh = onTokenRefresh;
    this.onLogout = onLogout;
  }

  // Generic request method with error handling
  async request<T = any>(config: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance(config);
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Token management
  setTokens(access: string, refresh: string): void {
    this.tokenStorage.setTokens(access, refresh);
  }

  clearTokens(): void {
    this.tokenStorage.clearTokens();
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }
}

// Create singleton instance
export const apiClient = new ApiClient(); 