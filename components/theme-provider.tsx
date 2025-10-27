'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

const DEFAULT_THEMES = ['light', 'dark', 'tokyo-night'] as const

export function ThemeProvider({
  children,
  themes,
  ...props
}: ThemeProviderProps) {
  const themeList = React.useMemo(
    () => (themes ? Array.from(new Set([...themes, ...DEFAULT_THEMES])) : [...DEFAULT_THEMES]),
    [themes],
  )

  return (
    <NextThemesProvider {...props} themes={themeList}>
      {children}
    </NextThemesProvider>
  )
}
