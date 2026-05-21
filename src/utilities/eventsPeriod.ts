export const EVENTS_PERIODS = ['all', 'upcoming', 'past'] as const

export type EventsPeriod = (typeof EVENTS_PERIODS)[number]

export function isEventsPeriod(value: string | null | undefined): value is EventsPeriod {
  return value === 'all' || value === 'upcoming' || value === 'past'
}
