import { createContext, useContext, useState, useEffect } from 'react'
import * as themes from '@uiw/codemirror-themes-all'
import { ThemeOption, CodeMirrorThemeContextType, CodeMirrorThemeProviderProps } from '../types'

const CodeMirrorThemeContext = createContext<CodeMirrorThemeContextType | null>(null);

export const CodeMirrorThemeProvider = ({ children }: CodeMirrorThemeProviderProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('codemirror-theme');
    return savedTheme || 'copilot';
  });

  useEffect(() => {
    localStorage.setItem('codemirror-theme', selectedTheme);
  }, [selectedTheme]);

  // Map theme keys to user-friendly display names
  const THEME_LABELS: Record<string, string> = {
    abcdef: 'Abcdef',
    abyss: 'Abyss',
    androidstudio: 'Android Studio',
    andromeda: 'Andromeda',
    atomone: 'Atom One',
    aura: 'Aura',
    basic: 'Basic',
    bbedit: 'BBEdit',
    bespin: 'Bespin',
    copilot: 'Copilot',
    darcula: 'Darcula',
    dracula: 'Dracula',
    duotone: 'Duotone',
    eclipse: 'Eclipse',
    github: 'GitHub',
    'gruvbox-dark': 'Gruvbox Dark',
    kimbie: 'Kimbie',
    material: 'Material',
    monokai: 'Monokai',
    'monokai-dimmed': 'Monokai Dimmed',
    'noctis-lilac': 'Noctis Lilac',
    nord: 'Nord',
    okaidia: 'Okaidia',
    quietlight: 'Quiet Light',
    red: 'Red',
    solarized: 'Solarized',
    sublime: 'Sublime',
    'tokyo-night': 'Tokyo Night',
    'tokyo-night-storm': 'Tokyo Night Storm',
    'tokyo-night-day': 'Tokyo Night Day',
    'tomorrow-night-blue': 'Tomorrow Night Blue',
    vscode: 'VS Code',
    white: 'White',
    xcode: 'Xcode',
  };

  const themeOptions: ThemeOption[] = [];
  Object.keys(themes).forEach(key => {
    if (key === key.toLowerCase()) {
      themeOptions.push({
        value: key,
        label: THEME_LABELS[key] || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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