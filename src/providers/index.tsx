import React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import type { LocaleCode } from '@/config/localization'
import type { PublicLocale } from '@/utilities/getPublicLocales'

import { HeaderThemeProvider } from './HeaderTheme'
import { LocaleProvider } from './Locale'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  locale: LocaleCode
  locales: PublicLocale[]
}> = ({ children, locale, locales }) => {
  return (
    <ThemeProvider>
      <LocaleProvider locale={locale} locales={locales}>
        <HeaderThemeProvider>
          <TooltipProvider delay={0}>{children}</TooltipProvider>
        </HeaderThemeProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
