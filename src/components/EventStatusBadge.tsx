'use client'

import { useLocaleContext } from '@/providers/Locale'
import { getEventStatusMessageKey, type EventStatus } from '@/utilities/eventStatus'
import { cn } from '@/utilities/ui'

const statusStyles: Record<EventStatus, string> = {
  scheduled: 'border-border bg-muted/60 text-foreground',
  sold_out: 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  cancelled: 'border-destructive/30 bg-destructive/10 text-destructive',
}

export function EventStatusBadge({
  status,
  className,
}: {
  status: EventStatus
  className?: string
}) {
  const { t } = useLocaleContext()

  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {t(getEventStatusMessageKey(status))}
    </span>
  )
}
