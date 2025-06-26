import { 
  User, 
  LoginFormData, 
  RegisterFormData, 
  LoginResponse, 
  RegisterResponse,
  PasswordResetRequestData,
  PasswordResetConfirmData
} from '../utils/validationSchemas';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (username: string, password: string, password2: string, email: string, first_name?: string, last_name?: string) => Promise<string>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface AuthFormProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

// ============================================================================
// FORM DATA ALIASES (for backward compatibility)
// ============================================================================

export type FormData = LoginFormData;
export type UserProfile = Pick<User, 'username' | 'email' | 'first_name' | 'last_name'>;

// ============================================================================
// API REQUEST TYPES
// ============================================================================

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

// ============================================================================
// RE-EXPORTS FROM VALIDATION SCHEMAS
// ============================================================================

export type {
  User,
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  RegisterResponse,
  PasswordResetRequestData,
  PasswordResetConfirmData
}; 