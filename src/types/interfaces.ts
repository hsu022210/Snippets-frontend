/* eslint-disable no-unused-vars */
import { AxiosResponse } from 'axios'

// Auth Related Interfaces
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (username: string, password: string, password2: string, email: string) => Promise<boolean>;
  api: any; // AxiosInstance
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthFormProps {
    title: string;
    className?: string;
    children: React.ReactNode;
  }

// Snippet Related Interfaces
export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  created: string;
  updated_at: string;
  user?: number;
}

export interface SnippetData {
  title: string;
  code: string;
  language: string;
}

export interface SnippetListResponse {
  results: Snippet[];
}

export interface SnippetHeaderProps {
  isEditing: boolean;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  saving: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  title: string;
  isAuthenticated: boolean;
  snippetId: string;
}

export interface SnippetCardProps {
  snippet: Snippet;
}

export interface SnippetLanguageSelectorProps {
  isEditing: boolean;
  editedLanguage: string;
  setEditedLanguage: (language: string) => void;
  language: string;
}

export interface SnippetLanguageFilterProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

// API Related Interfaces
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

export type ApiCall<T = any> = () => Promise<AxiosResponse<T>>;

export interface UseApiRequestReturn {
  makeRequest: <T = any>(apiCall: ApiCall<T>, loadingMessage?: string) => Promise<AxiosResponse<T>>;
}

// UI Component Interfaces
export interface ButtonProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isMobile?: boolean;
  [key: string]: any; // for other props
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any; // for other props
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  pageContainer?: boolean;
  [key: string]: any; // for other props
}

export interface FormFieldProps {
  label: string;
  type?: string;
  name?: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: string;
  isInvalid?: boolean;
}

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
  autoComplete?: string;
  placeholder?: string;
  isInvalid?: boolean;
  error?: string;
}

export interface PasswordRule {
  label: string;
  isValid: boolean;
}

export interface PasswordRulesProps {
  password: string;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export interface InlineLoadingSpinnerProps {
    message?: string;
    variant?: string;
  }

export interface LogoutLoadingSpinnerProps {
    show: boolean;
    message?: string;
  }

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  height?: string;
  editable?: boolean;
  className?: string;
}

export interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
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

// Context Related Interfaces
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeOption {
  value: string;
  label: string;
}

export interface CodeMirrorThemeContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  themeOptions: ThemeOption[];
}

export interface CodeMirrorThemeProviderProps {
  children: React.ReactNode;
}

export interface PreviewHeightContextType {
  previewHeight: number;
  setPreviewHeight: (height: number) => void;
}

export interface PreviewHeightProviderProps {
  children: React.ReactNode;
}

export type ToastType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface ToastContextType {
  showToast: (message?: string, type?: ToastType, autoHideDuration?: number) => void;
  hideToast: () => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface TestProvidersProps {
  children: React.ReactNode
}

export interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

// Route Related Interfaces
export interface PrivateRouteProps {
  children: React.ReactNode;
}

// Error Related Interfaces
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

// Environment Related Interfaces
export interface ImportMetaEnv {
  VITE_API_BASE_URL_DEPLOY: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface SnippetFilterValues {
  language: string;
  createdAfter: string;
  createdBefore: string;
}

export interface SnippetFilterProps {
  language: string;
  createdAfter: string;
  createdBefore: string;
  onFilterChange: (filters: SnippetFilterValues) => void;
}

export interface SnippetFilterSectionProps {
  language: string;
  createdAfter: string;
  createdBefore: string;
  onFilterChange: (filters: SnippetFilterValues) => void;
  onReset: () => void;
} 