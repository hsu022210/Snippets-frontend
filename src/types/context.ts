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
  children: React.ReactNode;
}

export interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
} 