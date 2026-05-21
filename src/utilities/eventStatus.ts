import type { MessageKey } from '@/i18n/messages'

export const EVENT_STATUS_OPTIONS = [
  { label: 'In programma', value: 'scheduled' },
  { label: 'Sold out', value: 'sold_out' },
  { label: 'Annullato', value: 'cancelled' },
] as const

export type EventStatus = (typeof EVENT_STATUS_OPTIONS)[number]['value']

/** Admin labels (Italian). Frontend uses i18n via `getEventStatusMessageKey`. */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: 'In programma',
  sold_out: 'Sold out',
  cancelled: 'Annullato',
}

export function getEventStatusMessageKey(status: EventStatus): MessageKey {
  switch (status) {
    case 'sold_out':
      return 'events.status.soldOut'
    case 'cancelled':
      return 'events.status.cancelled'
    default:
      return 'events.status.scheduled'
  }
}

export function getEventStatusLabel(status: EventStatus | null | undefined): string {
  if (!status) return EVENT_STATUS_LABELS.scheduled
  return EVENT_STATUS_LABELS[status] ?? EVENT_STATUS_LABELS.scheduled
}
