export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ApiRegisterErrorResponse {
  email?: string | string[];
  username?: string | string[];
  password?: string | string[];
  password2?: string | string[];
  detail?: string;
}

export interface ApiPasswordResetErrorResponse {
  password?: string | string[];
  password2?: string | string[];
  token?: string | string[];
  detail?: string;
} 