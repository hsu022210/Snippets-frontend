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