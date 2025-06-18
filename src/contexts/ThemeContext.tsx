import { createContext, useContext, useState, useEffect } from 'react'
import { ThemeContextType, ThemeProviderProps } from '../types'
import { getPrimaryColor, setPrimaryColor as setPrimaryColorStorage } from '../utils/primaryColor'
import hexRgb from 'hex-rgb'

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return getPrimaryColor();
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    setPrimaryColorStorage(primaryColor);
    // Apply primary color to CSS custom properties for React Bootstrap
    document.documentElement.style.setProperty('--bs-primary', primaryColor);
    document.documentElement.style.setProperty('--bs-primary-rgb', hexToRgb(primaryColor));
  }, [primaryColor]);

  const toggleTheme = () => setIsDark(!isDark);

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const hexToRgb = (hex: string): string => {
    try {
      const { red, green, blue } = hexRgb(hex);
      return `${red}, ${green}, ${blue}`;
    } catch {
      return '0, 0, 0';
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}; 