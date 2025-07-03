import * as themes from '@uiw/codemirror-themes-all'
import { Extension } from '@codemirror/state'
import { ThemeOption } from '../types'

const THEME_STORAGE_KEY = 'codemirror-theme'

// Optional: Map theme keys to user-friendly display names
export const THEME_LABELS: Record<string, string> = {
  abcdef: 'Abcdef',
  abyss: 'Abyss',
  androidstudio: 'Android Studio',
  andromeda: 'Andromeda',
  atomone: 'Atom One',
  aura: 'Aura',
  basicDark: 'Basic Dark',
  basicLight: 'Basic Light',
  bbedit: 'BBEdit',
  bespin: 'Bespin',
  consoleDark: 'Console Dark',
  consoleLight: 'Console Light',
  copilot: 'Copilot',
  darcula: 'Darcula',
  dracula: 'Dracula',
  duotoneDark: 'Duotone Dark',
  duotoneLight: 'Duotone Light',
  eclipse: 'Eclipse',
  githubDark: 'GitHub Dark',
  githubLight: 'GitHub Light',
  gruvboxDark: 'Gruvbox Dark',
  gruvboxLight: 'Gruvbox Light',
  kimbie: 'Kimbie',
  material: 'Material',
  materialDark: 'Material Dark',
  materialLight: 'Material Light',
  monokai: 'Monokai',
  monokaiDimmed: 'Monokai Dimmed',
  noctisLilac: 'Noctis Lilac',
  nord: 'Nord',
  okaidia: 'Okaidia',
  quietlight: 'Quiet Light',
  red: 'Red',
  solarizedDark: 'Solarized Dark',
  solarizedLight: 'Solarized Light',
  sublime: 'Sublime',
  tokyoNight: 'Tokyo Night',
  tokyoNightStorm: 'Tokyo Night Storm',
  tokyoNightDay: 'Tokyo Night Day',
  tomorrowNightBlue: 'Tomorrow Night Blue',
  vscodeLight: 'VS Code Light',
  vscodeDark: 'VS Code Dark',
  whiteDark: 'White Dark',
  whiteLight: 'White Light',
  xcodeDark: 'Xcode Dark',
  xcodeLight: 'Xcode Light',
}

// Dynamically get all available theme keys
export const getAvailableThemeKeys = (): string[] => {
  return Object.keys(themes).filter(function (k) {
    return (
      k.toLowerCase().indexOf('style') === -1 &&
      k.toLowerCase().indexOf('defaultsettings') === -1 &&
      k.toLowerCase().indexOf('init') === -1
    )
  })
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
  const themeKeys = getAvailableThemeKeys()
  themeKeys.forEach(key => {
    themeOptions.push({
      value: key,
      label: THEME_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').replace(/^\w|\s\w/g, c => c.toUpperCase()),
    })
  })
  return themeOptions
}

export const getThemeExtension = (themeName: string): Extension | undefined => {
  // Type assertion to handle theme access
  return (themes as unknown as Record<string, Extension>)[themeName]
} 