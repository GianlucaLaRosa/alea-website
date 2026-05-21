import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { EventsCarousel } from './EventsCarousel'
import type { Event } from '@/payload-types'
import { serializeEventForClient } from '@/utilities/serializeEventForClient'

function byStartAtAsc(a: Event, b: Event) {
  const t0 = new Date(a.startAt).getTime()
  const t1 = new Date(b.startAt).getTime()
  return t0 - t1
}

export async function EventsCarouselSection() {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  const { totalDocs } = await payload.find({
    collection: 'events',
    depth: 0,
    limit: 1,
    overrideAccess: false,
  })

  if (totalDocs === 0) {
    return null
  }

  const { docs: upcomingRaw } = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 24,
    overrideAccess: false,
    sort: 'startAt',
    where: {
      endAt: {
        greater_than: now,
      },
    },
  })

  let sourceDocs: Event[]
  let pastEventsOnly: boolean

  if (upcomingRaw.length > 0) {
    sourceDocs = [...(upcomingRaw as Event[])].sort(byStartAtAsc)
    pastEventsOnly = false
  } else {
    const { docs: pastRaw } = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 5,
      overrideAccess: false,
      sort: '-startAt',
      where: {
        endAt: {
          less_than_equal: now,
        },
      },
    })

    if (pastRaw.length === 0) {
      return null
    }

    sourceDocs = [...(pastRaw as Event[])].sort(byStartAtAsc)
    pastEventsOnly = true
  }

  const events = sourceDocs
    .map((doc) => serializeEventForClient(doc))
    .filter((e): e is NonNullable<typeof e> => e !== null)

  if (events.length === 0) {
    return null
  }

  return <EventsCarousel events={events} pastEventsOnly={pastEventsOnly} />
}
