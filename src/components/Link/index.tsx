import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  /** Appended as URL hash for internal (reference) links only */
  referenceAnchor?: string | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    referenceAnchor,
    size: sizeFromProps,
    url,
  } = props

  let href: string | null = null

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    const prefix = reference.relationTo === 'pages' ? '' : `/${reference.relationTo}`
    href = `${prefix}/${reference.value.slug}`
    const frag = referenceAnchor?.trim().replace(/^#/, '') ?? ''
    if (frag) href = `${href.split('#')[0]}#${frag}`
  } else if (url) {
    href = url
  }

  if (!href) return null

  const size = appearance === 'link' ? undefined : (sizeFromProps ?? undefined)
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <Button
      className={cn(className)}
      nativeButton={false}
      render={
        <Link href={href} {...newTabProps} >
          {label}
          {children}
        </Link>
      }
      size={size}
      variant={appearance === 'inline' ? 'link' : appearance}
    />
  )
}
