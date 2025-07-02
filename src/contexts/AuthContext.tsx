import { createContext, useContext, useState, useEffect } from 'react'
import { useApiRequest } from '../hooks/useApiRequest'
import { useToast } from './ToastContext'
import { User, AuthContextType, AuthProviderProps } from '../types'
import { authService, apiClient } from '../services'

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

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authService.getAccessToken());
  const { makeRequest } = useApiRequest();
  const { showToast } = useToast();

  // Set up API client callbacks
  useEffect(() => {
    apiClient.setCallbacks(
      (access: string, refresh: string) => {
        setToken(access);
        authService.setTokens(access, refresh);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
  }, []);

  // Initialize user data
  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        try {
          const userData = await makeRequest(
            () => authService.getCurrentUser()
          );
          setUser(userData);
        } catch (error) {
          console.error('Error initializing user:', error);
          handleLogout();
        }
      }
    };

    initializeUser();
  }, [token, makeRequest, showToast]);

  // Auth state management
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    authService.clearTokens();
  };

  const updateAuthState = (access: string, refresh: string) => {
    setToken(access);
    authService.setTokens(access, refresh);
  };

  // Auth operations
  const register = async (username: string, password: string, password2: string, email: string, first_name?: string, last_name?: string): Promise<string> => {
    try {
      // First, register the user
      await makeRequest(
        () => authService.register(username, password, password2, email, first_name, last_name)
      );
      
      // Then automatically log in the user to get tokens
      const loginResponse = await makeRequest(
        () => authService.login(email, password)
      );
      
      // Update auth state with the login tokens
      updateAuthState(loginResponse.access, loginResponse.refresh);
      
      return loginResponse.access;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await makeRequest(
        () => authService.login(email, password)
      );
      
      updateAuthState(response.access, response.refresh);

      const userData = await makeRequest(
        () => authService.getCurrentUser()
      );
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await makeRequest(
        () => authService.logout()
      );
      handleLogout();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed, but you have been logged out locally', 'warning');
      handleLogout(); // Still logout locally even if API call fails
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 