import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '../types';
import { z } from 'zod';

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
  public data: unknown;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 0, data: unknown = null, isNetworkError: boolean = false) {
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

type RetryableAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean };

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
        const originalRequest = error.config as RetryableAxiosRequestConfig;

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

  // Generic request method with error handling and response validation
  async request<T = unknown>(config: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance(config);
      
      // Validate response data if schema is provided
      if (schema) {
        const validation = schema.safeParse(response.data);
        if (!validation.success) {
          console.warn('API response validation failed:', validation.error);
          // Still return the data but log the validation error
        }
      }
      
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // HTTP methods with response validation
  async get<T = unknown>(url: string, config?: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url }, schema);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data }, schema);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data }, schema);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data }, schema);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig, schema?: z.ZodSchema<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url }, schema);
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