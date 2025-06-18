import * as themes from '@uiw/codemirror-themes-all'
import { Extension } from '@codemirror/state'
import { ThemeOption } from '../types'

const THEME_STORAGE_KEY = 'codemirror-theme'

// Map theme keys to user-friendly display names
export const THEME_LABELS: Record<string, string> = {
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
}

export const getSelectedTheme = (): string => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  return savedTheme || 'copilot'
}

export const setSelectedTheme = (theme: string): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export const getThemeOptions = (): ThemeOption[] => {
  const themeOptions: ThemeOption[] = []
  Object.keys(themes).forEach(key => {
    if (key === key.toLowerCase()) {
      themeOptions.push({
        value: key,
        label: THEME_LABELS[key] || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      })
    }
  })
  return themeOptions
}

export const getThemeExtension = (themeName: string): Extension => {
  // Type assertion to handle theme access
  const theme = (themes as unknown as Record<string, Extension>)[themeName]
  return theme
} 