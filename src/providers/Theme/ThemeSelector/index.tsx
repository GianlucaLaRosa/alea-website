'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocaleContext } from '@/providers/Locale'
import { cn } from '@/utilities/ui'
import React from 'react'
import { SunMoon } from 'lucide-react'

import { useTheme } from '..'

export type ThemeSelectorProps = {
  className?: string
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const { t } = useLocaleContext()

  const isDark = theme === 'dark'
  const tooltipLabel = isDark ? t('theme.light') : t('theme.dark')

  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn('shrink-0 text-primary', className)}
            aria-label={tooltipLabel}
            aria-pressed={isDark}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            <SunMoon className="size-5" aria-hidden />
          </Button>
        }
      />
      <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
    </Tooltip>
  )
}
