'use client'
import { SiteLogo } from '@/components/SiteLogo'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="px-0! container relative z-20 border-b-3 border-accent" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="relative flex w-full items-center justify-end gap-3 py-6 pr-4 sm:gap-4">
        <SiteLogo
          header={data}
          className="absolute left-8 top-7 flex h-28 w-28 shrink-0 items-center"
          priority
        />
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
