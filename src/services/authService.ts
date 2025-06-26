import { apiClient } from './api';
import { User, UserProfile, LoginResponse, RegisterResponse, PasswordResetResponse } from '../types';
import { 
  loginResponseSchema, 
  registerResponseSchema, 
  userSchema,
  LoginResponse as ZodLoginResponse,
  RegisterResponse as ZodRegisterResponse,
  User as ZodUser
} from '../utils/validationSchemas';

export class AuthService {
  // User authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<ZodLoginResponse>('/auth/login/', {
      email,
      password,
    }, undefined, loginResponseSchema);
  }

  async register(username: string, password: string, password2: string, email: string, first_name: string = '', last_name: string = ''): Promise<RegisterResponse> {
    return apiClient.post<ZodRegisterResponse>('/auth/register/', {
      username,
      password,
      password2,
      email,
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
    }, undefined, registerResponseSchema);
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
    return apiClient.get<ZodUser>('/auth/user/', undefined, userSchema);
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<User> {
    return apiClient.patch<ZodUser>('/auth/user/', profile, undefined, userSchema);
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