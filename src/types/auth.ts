export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (username: string, password: string, password2: string, email: string) => Promise<boolean>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthFormProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export interface FormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  access: string;
  refresh: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface PasswordResetResponse {
  message: string;
} 