import { apiClient } from './api';
import { User, UserProfile, LoginResponse, RegisterResponse, PasswordResetResponse } from '../types';

export class AuthService {
  // User authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login/', {
      email,
      password,
    });
  }

  async register(username: string, password: string, password2: string, email: string): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register/', {
      username,
      password,
      password2,
      email,
    });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      // Logout should succeed even if the API call fails
      console.warn('Logout API call failed, but proceeding with local logout:', error);
    } finally {
      apiClient.clearTokens();
    }
  }

  // User profile management
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/user/');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<User> {
    return apiClient.patch<User>('/auth/user/', profile);
  }

  // Password reset
  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>('/auth/password-reset/', { email });
  }

  async confirmPasswordReset(token: string, password: string): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>('/auth/password-reset/confirm/', {
      token,
      password,
    });
  }

  // Token management
  setTokens(access: string, refresh: string): void {
    apiClient.setTokens(access, refresh);
  }

  clearTokens(): void {
    apiClient.clearTokens();
  }

  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService(); 