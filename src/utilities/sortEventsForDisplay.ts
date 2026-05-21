import type { Event } from '@/payload-types'

export function byStartAtAsc(a: Pick<Event, 'startAt'>, b: Pick<Event, 'startAt'>): number {
  return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
}

/** In evidenza prima, poi per data di inizio. */
export function sortEventsForDisplay<T extends Pick<Event, 'startAt' | 'featured'>>(docs: T[]): T[] {
  return [...docs].sort((a, b) => {
    const af = Boolean(a.featured)
    const bf = Boolean(b.featured)
    if (af !== bf) return af ? -1 : 1
    return byStartAtAsc(a, b)
  })
}
