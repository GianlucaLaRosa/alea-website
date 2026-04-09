'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
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
      <div className="py-6 pr-4 flex justify-end w-full">
        <Link href="/" className="flex items-center shrink-0 h-28 w-28 absolute left-8 top-7">
          {typeof data.logo === 'object' && data.logo?.url ? (
            <Media
              resource={data.logo}
              htmlElement={null}
              imgClassName="max-h-28 w-auto max-w-[12rem]"
              priority
            />
          ) : (
            <Logo loading="eager" priority="high" className="dark:invert-0" />
          )}
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
