'use client'

import * as React from 'react'
import { MonitorCog, Moon, Palette, SunMedium } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ThemeOption = {
  value: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: SunMedium },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'tokyo-night', label: 'Tokyo Night', icon: Palette },
  { value: 'system', label: 'System', icon: MonitorCog },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeValue = isMounted ? theme ?? 'system' : 'tokyo-night'
  const activeOption = THEME_OPTIONS.find((option) => option.value === activeValue) ?? THEME_OPTIONS[0]
  const ActiveIcon = activeOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ActiveIcon className="size-4" aria-hidden="true" />
          <span className="hidden text-sm font-medium sm:inline">{activeOption.label}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={activeValue} onValueChange={(nextTheme) => setTheme(nextTheme)}>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2">
                <Icon className="size-4" aria-hidden="true" />
                {option.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
