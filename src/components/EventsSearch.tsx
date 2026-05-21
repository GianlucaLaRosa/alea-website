'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { useLocaleContext } from '@/providers/Locale'
import { buildEventiHref, getEventiListParams } from '@/utilities/eventiSearchParams'
import { cn } from '@/utilities/ui'

const DEBOUNCE_MS = 350

type Props = {
  totalDocs: number
  className?: string
}

export function EventsSearch({ totalDocs, className }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { period, q: urlQ } = getEventiListParams(searchParams)
  const { t, tf } = useLocaleContext()

  const [value, setValue] = React.useState(urlQ)
  const hasQuery = value.trim().length > 0

  React.useEffect(() => {
    setValue(urlQ)
  }, [urlQ])

  React.useEffect(() => {
    const trimmed = value.trim()
    if (trimmed === urlQ) return

    const timeout = window.setTimeout(() => {
      router.replace(
        buildEventiHref(pathname, {
          period,
          q: trimmed || null,
          page: 1,
        }),
      )
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [value, urlQ, period, pathname, router])

  const clear = () => setValue('')

  const foundLabel = tf('events.search.found', { count: totalDocs })

  return (
    <div className={cn('mb-8', className)}>
      <label className="sr-only" htmlFor="events-search">
        {t('events.search.label')}
      </label>
      <div className="relative max-w-xl">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          autoComplete="off"
          className="pr-10 pl-9"
          id="events-search"
          placeholder={t('events.search.placeholder')}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {hasQuery ? (
          <button
            aria-label={t('events.search.clear')}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
            onClick={clear}
          >
            <XIcon aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
      {hasQuery ? (
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          {totalDocs === 0 ? t('events.search.noResults') : foundLabel}
        </p>
      ) : null}
    </div>
  )
}
