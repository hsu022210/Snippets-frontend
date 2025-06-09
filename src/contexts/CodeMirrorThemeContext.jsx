import React, { createContext, useContext, useState, useEffect } from 'react';
import * as themes from '@uiw/codemirror-themes-all';

const CodeMirrorThemeContext = createContext();

export const CodeMirrorThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem('codemirror-theme');
    return savedTheme || 'copilot';
  });

  useEffect(() => {
    localStorage.setItem('codemirror-theme', selectedTheme);
  }, [selectedTheme]);

  const themeOptions = [];
  Object.keys(themes).forEach(key => {
    if ((key === key.toLowerCase())) {
        themeOptions.push({
            value: key,
            label: key
        });
    };
  })

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