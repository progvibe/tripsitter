'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface TopBarProps {
  leftSlot: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
  containerClassName?: string
}

export function TopBar({
  leftSlot,
  rightSlot,
  className,
  containerClassName,
}: TopBarProps) {
  return (
    <header className={cn("border-b border-border", className)}>
      <div
        className={cn(
          "container mx-auto flex h-16 items-center justify-between px-4",
          containerClassName,
        )}
      >
        <div className="flex items-center gap-2">{leftSlot}</div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeSwitcher />
          {rightSlot}
        </div>
      </div>
    </header>
  )
}
