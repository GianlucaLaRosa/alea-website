import Link from 'next/link'
import type { ReactNode } from 'react'

import { HighlightMatch } from '@/components/HighlightMatch'
import { getTagColorStyles } from '@/utilities/tagColorStyles'
import { cn } from '@/utilities/ui'

type TagBadgeProps = {
  color?: string | null
  children: ReactNode
  className?: string
  highlightQuery?: string
  href?: string
}

const badgeClassName =
  'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-90'

export function TagBadge({
  color,
  children,
  className,
  highlightQuery,
  href,
}: TagBadgeProps) {
  const styles = getTagColorStyles(color)
  const content =
    highlightQuery?.trim() && typeof children === 'string' ? (
      <HighlightMatch query={highlightQuery} text={children} />
    ) : (
      children
    )

  const classNames = cn(badgeClassName, className)

  if (href) {
    return (
      <Link className={classNames} href={href} style={styles}>
        {content}
      </Link>
    )
  }

  return (
    <span className={classNames} style={styles}>
      {content}
    </span>
  )
}
