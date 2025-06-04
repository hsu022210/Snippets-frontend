import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [api] = useState(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to always include the latest token
    instance.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Clear auth state on unauthorized
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  });

  // Initialize user data if token exists
  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/user/');
          setUser(response.data);
        } catch (error) {
          console.error('Error initializing user:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    };

    initializeUser();
  }, [token, api]);

  const register = async (username, password, password2) => {
    try {
      // Register the user
      await api.post('/auth/register/', {
        username,
        password,
        password2,
        email: '', // Optional in our case
      });

      // If registration successful, login automatically
      return await login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password,
      });
      
      const { access } = response.data;
      setToken(access);
      localStorage.setItem('token', access);

      // Fetch user data
      const userResponse = await api.get('/auth/user/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout/');
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
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