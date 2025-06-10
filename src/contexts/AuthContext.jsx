import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useApiRequest } from '../hooks/useApiRequest';

// Constants
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const isDevelopment = import.meta.env.MODE === 'development';
export const BASE_URL = isDevelopment ? 'http://localhost:8000' : import.meta.env.VITE_API_BASE_URL_DEPLOY;

// Context
const AuthContext = createContext();

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
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access, refresh) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// API instance configuration
const createApiInstance = (baseURL, makeRequest) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const currentToken = tokenStorage.getAccessToken();
      if (currentToken) {
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
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
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
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(tokenStorage.getAccessToken());
  const [, setRefreshToken] = useState(tokenStorage.getRefreshToken());
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

  const updateAuthState = (access, refresh) => {
    setToken(access);
    setRefreshToken(refresh);
    tokenStorage.setTokens(access, refresh);
  };

  // Auth operations
  const register = async (username, password, password2, email) => {
    try {
      await makeRequest(
        () => api.post('/auth/register/', {
          username,
          password,
          password2,
          email,
        })
      );
      return await login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await makeRequest(
        () => api.post('/auth/login/', {
          username,
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

  const logout = async () => {
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

  const value = {
    user,
    token,
    login,
    logout,
    register,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 