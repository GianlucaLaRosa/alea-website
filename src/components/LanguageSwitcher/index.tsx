'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utilities/ui'
import { Languages } from 'lucide-react'
import React from 'react'

import type { LocaleCode } from '@/config/localization'
import { useLocaleContext } from '@/providers/Locale'

export type LanguageSwitcherProps = {
  className?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { locale, locales, setLocale, t } = useLocaleContext()

  if (locales.length <= 1) return null

  const current = locales.find((l) => l.code === locale)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-primary hover:bg-muted',
          className,
        )}
        delay={120}
        closeDelay={80}
        aria-label={t('language.select')}
      >
        <Languages className="size-4 shrink-0" aria-hidden />
        <span className="uppercase tracking-wide">{current?.label ?? locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {locales.map((item) => (
          <DropdownMenuLinkItem
            key={item.code}
            onClick={() => setLocale(item.code as LocaleCode)}
            className={cn(item.code === locale && 'font-semibold')}
          >
            {item.label}
          </DropdownMenuLinkItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
