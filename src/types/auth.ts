import { 
  User, 
  LoginFormData, 
  RegisterFormData, 
  LoginResponse, 
  RegisterResponse,
  PasswordResetRequestData,
  PasswordResetConfirmData,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse
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
// RE-EXPORTS FROM VALIDATION SCHEMAS
// ============================================================================

export type {
  User,
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  RegisterResponse,
  PasswordResetRequestData,
  PasswordResetConfirmData,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse
}; 