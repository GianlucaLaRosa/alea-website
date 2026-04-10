'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

export type ThemeSelectorProps = {
  className?: string
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: string | null) => {
    if (themeToSet === 'auto' || themeToSet === null) {
      setTheme(null)
      setValue('auto')
    } else if (themeToSet === 'light' || themeToSet === 'dark') {
      setTheme(themeToSet as Theme)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className={cn(
          'w-auto gap-2 border-none bg-transparent pl-0 text-primary md:pl-3',
          className,
        )}
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
