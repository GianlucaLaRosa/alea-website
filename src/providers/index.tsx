import React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TooltipProvider delay={0}>{children}</TooltipProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
