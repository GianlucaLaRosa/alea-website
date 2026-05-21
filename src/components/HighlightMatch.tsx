'use client'

import * as React from 'react'

import { buildSearchRegex, getSearchTokens } from '@/utilities/eventSearch'
import { cn } from '@/utilities/ui'

type Props = {
  text: string
  query: string
  className?: string
}

export function HighlightMatch({ text, query, className }: Props) {
  const tokens = React.useMemo(() => getSearchTokens(query), [query])
  const regex = React.useMemo(() => buildSearchRegex(tokens), [tokens])

  if (!regex || !text) {
    return <span className={className}>{text}</span>
  }

  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = tokens.includes(part.toLowerCase())
        if (!isMatch) {
          return <React.Fragment key={index}>{part}</React.Fragment>
        }
        return (
          <mark
            key={index}
            className={cn(
              'rounded-sm bg-primary/20 text-foreground',
              'decoration-primary/50 underline-offset-2',
            )}
          >
            {part}
          </mark>
        )
      })}
    </span>
  )
}
