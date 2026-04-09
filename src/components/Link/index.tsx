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
  /** Fires after navigation intent (e.g. close mobile menu) */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
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

export type CMSLinkHrefInput = Pick<
  CMSLinkType,
  'type' | 'reference' | 'referenceAnchor' | 'url'
>

export function resolveCMSLinkHref({
  type,
  reference,
  referenceAnchor,
  url,
}: CMSLinkHrefInput): string | null {
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    const prefix = reference.relationTo === 'pages' ? '' : `/${reference.relationTo}`
    let href = `${prefix}/${reference.value.slug}`
    const frag = referenceAnchor?.trim().replace(/^#/, '') ?? ''
    if (frag) href = `${href.split('#')[0]}#${frag}`
    return href
  }
  if (url) return url
  return null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    onClick,
    newTab,
    reference,
    referenceAnchor,
    size: sizeFromProps,
    url,
  } = props

  const href = resolveCMSLinkHref({ type, reference, referenceAnchor, url })

  if (!href) return null

  const size = appearance === 'link' ? undefined : (sizeFromProps ?? undefined)
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <Button
      className={cn(className)}
      nativeButton={false}
      render={
        <Link href={href} {...newTabProps} onClick={onClick}>
          {label}
          {children}
        </Link>
      }
      size={size}
      variant={appearance === 'inline' ? 'link' : appearance}
    />
  )
}
