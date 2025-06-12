import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as themes from '@uiw/codemirror-themes-all';

interface ThemeOption {
  value: string;
  label: string;
}

interface CodeMirrorThemeContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  themeOptions: ThemeOption[];
}

interface CodeMirrorThemeProviderProps {
  children: ReactNode;
}

const CodeMirrorThemeContext = createContext<CodeMirrorThemeContextType | null>(null);

export const CodeMirrorThemeProvider = ({ children }: CodeMirrorThemeProviderProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('codemirror-theme');
    return savedTheme || 'copilot';
  });

  useEffect(() => {
    localStorage.setItem('codemirror-theme', selectedTheme);
  }, [selectedTheme]);

  const themeOptions: ThemeOption[] = [];
  Object.keys(themes).forEach(key => {
    if (key === key.toLowerCase()) {
      themeOptions.push({
        value: key,
        label: key
      });
    }
  });

  return (
    <CodeMirrorThemeContext.Provider value={{ selectedTheme, setSelectedTheme, themeOptions }}>
      {children}
    </CodeMirrorThemeContext.Provider>
  );
};

export const useCodeMirrorTheme = () => {
  const context = useContext(CodeMirrorThemeContext);
  if (!context) {
    throw new Error('useCodeMirrorTheme must be used within a CodeMirrorThemeProvider');
  }
  return context;
}; 