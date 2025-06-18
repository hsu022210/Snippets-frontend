export interface ButtonProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isMobile?: boolean;
  [key: string]: any;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  pageContainer?: boolean;
  [key: string]: any;
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

export interface PaginationItemsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export interface EditorSettingsProps {
  selectedTheme: string;
  themeOptions: { value: string; label: string; }[];
  previewHeight: number;
  isDark: boolean;
  onThemeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPreviewHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface DisplaySettingsProps {
  pageSize: number;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isDark: boolean;
}

export interface GeneralSettingsProps {
  isDark: boolean;
  onThemeToggle: () => void;
} 