export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface ApiRegisterErrorResponse {
  detail: {
    email?: string | string[];
    username?: string | string[];
    password?: string | string[];
    password2?: string | string[];
    detail?: string;
  };
} 