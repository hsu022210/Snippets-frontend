import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useApiRequest } from '../hooks/useApiRequest';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (username: string, password: string, password2: string, email: string) => Promise<boolean>;
  api: AxiosInstance
}

interface AuthProviderProps {
  children: ReactNode;
}

// Constants
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const isDevelopment = import.meta.env.MODE === 'development';
export const BASE_URL = isDevelopment ? 'http://localhost:8000' : import.meta.env.VITE_API_BASE_URL_DEPLOY;

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token management utilities
const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// API instance configuration
const createApiInstance = (baseURL: string, makeRequest: Function): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const currentToken = tokenStorage.getAccessToken();
      if (currentToken && config.headers) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await makeRequest(
            () => axios.post(`${baseURL}/auth/login/refresh/`, {
              refresh: refreshToken
            })
          );

          const { access } = response.data;
          tokenStorage.setTokens(access, refreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          tokenStorage.clearTokens();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.getAccessToken());
  const [, setRefreshToken] = useState<string | null>(tokenStorage.getRefreshToken());
  const { makeRequest } = useApiRequest();
  const [api] = useState(() => createApiInstance(BASE_URL, makeRequest));

  // Initialize user data
  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        try {
          const response = await makeRequest(
            () => api.get('/auth/user/')
          );
          setUser(response.data);
        } catch (error) {
          console.error('Error initializing user:', error);
          handleLogout();
        }
      }
    };

    initializeUser();
  }, [token, api, makeRequest]);

  // Auth state management
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    tokenStorage.clearTokens();
  };

  const updateAuthState = (access: string, refresh: string) => {
    setToken(access);
    setRefreshToken(refresh);
    tokenStorage.setTokens(access, refresh);
  };

  // Auth operations
  const register = async (username: string, password: string, password2: string, email: string): Promise<boolean> => {
    try {
      await makeRequest(
        () => api.post('/auth/register/', {
          username,
          password,
          password2,
          email,
        })
      );
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await makeRequest(
        () => api.post('/auth/login/', {
          email,
          password,
        })
      );
      
      const { access, refresh } = response.data;
      updateAuthState(access, refresh);

      const userResponse = await makeRequest(
        () => api.get('/auth/user/', {
          headers: { Authorization: `Bearer ${access}` }
        })
      );
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      handleLogout();
      
      if (token) {
        await makeRequest(
          () => api.post('/auth/logout/')
        ).catch(console.error);
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    register,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 