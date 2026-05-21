import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

function isInProgress(event: SerializedEventForClient, now: number): boolean {
  const start = new Date(event.startAt).getTime()
  const end = new Date(event.endAt).getTime()
  return start <= now && end > now
}

function isUpcoming(event: SerializedEventForClient, now: number): boolean {
  return new Date(event.endAt).getTime() > now
}

/**
 * Preferisce eventi in evidenza tra quelli in corso / futuri, poi l’ordine dell’array
 * (già ordinato con featured prima).
 */
function pickEventIndex(
  events: SerializedEventForClient[],
  predicate: (event: SerializedEventForClient) => boolean,
): number {
  const matches = events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => predicate(event))

  if (matches.length === 0) return -1

  matches.sort((a, b) => {
    const featuredDelta = Number(b.event.featured) - Number(a.event.featured)
    if (featuredDelta !== 0) return featuredDelta
    return a.index - b.index
  })

  return matches[0].index
}

/** Indice slide Embla (0 = "Tutti gli eventi", 1+ = eventi). */
export function getEventsCarouselStartIndex(events: SerializedEventForClient[]): number {
  if (events.length === 0) return 0

  const now = Date.now()

  const inProgressIndex = pickEventIndex(events, (event) => isInProgress(event, now))
  if (inProgressIndex >= 0) {
    return inProgressIndex + 1
  }

  const upcomingIndex = pickEventIndex(events, (event) => isUpcoming(event, now))
  const eventIndex = upcomingIndex >= 0 ? upcomingIndex : 0
  return eventIndex + 1
}
