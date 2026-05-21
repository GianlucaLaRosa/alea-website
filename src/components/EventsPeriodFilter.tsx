'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useLocaleContext } from '@/providers/Locale'
import { cn } from '@/utilities/ui'
import { buildEventiHref, getEventiListParams } from '@/utilities/eventiSearchParams'
import type { EventsPeriod } from '@/utilities/eventsPeriod'
import type { MessageKey } from '@/i18n/messages'

const periodKeys: { value: EventsPeriod; labelKey: MessageKey }[] = [
  { value: 'all', labelKey: 'events.period.all' },
  { value: 'upcoming', labelKey: 'events.period.upcoming' },
  { value: 'past', labelKey: 'events.period.past' },
]

export type { EventsPeriod } from '@/utilities/eventsPeriod'

export function EventsPeriodFilter() {
  const searchParams = useSearchParams()
  const { period: activePeriod, q } = getEventiListParams(searchParams)
  const { t } = useLocaleContext()

  return (
    <nav aria-label={t('events.filter.aria')} className="mb-4 flex flex-wrap gap-2">
      {periodKeys.map(({ value, labelKey }) => {
        const active = activePeriod === value
        return (
          <Link
            key={value}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
            href={buildEventiHref('/eventi', { period: value, q: q || null, page: 1 })}
          >
            {t(labelKey)}
          </Link>
        )
      })}
    </nav>
  )
}
