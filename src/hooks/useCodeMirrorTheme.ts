import { useState, useEffect } from 'react'
import { getSelectedTheme, setSelectedTheme, getThemeOptions } from '../utils/codeMirrorThemeUtils'

export const useCodeMirrorTheme = () => {
  const [selectedTheme, setLocalSelectedTheme] = useState<string>(getSelectedTheme)

  useEffect(() => {
    setSelectedTheme(selectedTheme)
  }, [selectedTheme])

  const handleSetSelectedTheme = (theme: string) => {
    setLocalSelectedTheme(theme)
  }

  const themeOptions = getThemeOptions()

  return {
    selectedTheme,
    setSelectedTheme: handleSetSelectedTheme,
    themeOptions
  }
} 