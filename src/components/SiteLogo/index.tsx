'use client'

import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type SiteLogoProps = Readonly<{
  header: Header
  className?: string
  imgClassName?: string | null
  /** Header uses eager/high; footer can use lazy */
  priority?: boolean
}>

/** Default dimensioni logo: un solo merge qui evita classi diverse tra SSR e client su imgClassName serializzato. */
function resolveImgClassName(explicit?: string | null): string {
  if (explicit != null && explicit !== '') {
    return explicit
  }
  return 'max-h-28 w-auto max-w-[12rem]'
}

export function SiteLogo({
  header,
  className = 'flex items-center shrink-0',
  imgClassName,
  priority = false,
}: SiteLogoProps) {
  const imageClassName = cn('dark:invert-0', resolveImgClassName(imgClassName))

  return (
    <Link className={className} href="/">
      {typeof header.logo === 'object' && header.logo?.url ? (
        <Media
          resource={header.logo}
          htmlElement={null}
          imgClassName={imageClassName}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      ) : (
        <Logo
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? { priority: 'high' as const } : {})}
          className={imageClassName}
        />
      )}
    </Link>
  )
}
