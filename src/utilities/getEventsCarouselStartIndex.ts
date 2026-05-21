import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

/** Indice slide Embla (0 = "Tutti gli eventi", 1+ = eventi ordinati per startAt ascendente). */
export function getEventsCarouselStartIndex(events: SerializedEventForClient[]): number {
  if (events.length === 0) return 0

  const now = Date.now()

  const inProgressIndex = events.findIndex((event) => {
    const start = new Date(event.startAt).getTime()
    const end = new Date(event.endAt).getTime()
    return start <= now && end > now
  })

  if (inProgressIndex >= 0) {
    return inProgressIndex + 1
  }

  const upcomingIndex = events.findIndex(
    (event) => new Date(event.endAt).getTime() > now,
  )

  const eventIndex = upcomingIndex >= 0 ? upcomingIndex : 0
  return eventIndex + 1
}
