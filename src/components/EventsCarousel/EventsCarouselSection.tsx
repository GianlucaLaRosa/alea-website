import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { EventsCarousel } from './EventsCarousel'
import type { Event } from '@/payload-types'
import { eventVisibilityWhere } from '@/utilities/eventVisibilityWhere'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { getRequestLocale } from '@/utilities/getRequestLocale'
import { serializeEventForClient } from '@/utilities/serializeEventForClient'
import { sortEventsForDisplay } from '@/utilities/sortEventsForDisplay'

const MAX_PAST_IN_CAROUSEL = 2

export async function EventsCarouselSection() {
  const payload = await getPayload({ config: configPromise })
  const [locale, localeOptions] = await Promise.all([getRequestLocale(), getPayloadLocaleOptions()])
  const now = new Date().toISOString()

  const { totalDocs } = await payload.find({
    collection: 'events',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: eventVisibilityWhere,
    ...localeOptions,
  })

  if (totalDocs === 0) {
    return null
  }

  const [{ docs: upcomingRaw }, { docs: pastRaw }] = await Promise.all([
    payload.find({
      collection: 'events',
      depth: 2,
      draft: false,
      limit: 24,
      overrideAccess: false,
      sort: 'startAt',
      where: {
        and: [
          eventVisibilityWhere,
          {
            endAt: {
              greater_than: now,
            },
          },
        ],
      },
      ...localeOptions,
    }),
    payload.find({
      collection: 'events',
      depth: 2,
      draft: false,
      limit: MAX_PAST_IN_CAROUSEL,
      overrideAccess: false,
      sort: '-startAt',
      where: {
        and: [
          eventVisibilityWhere,
          {
            endAt: {
              less_than_equal: now,
            },
          },
        ],
      },
      ...localeOptions,
    }),
  ])

  const upcoming = sortEventsForDisplay(upcomingRaw as Event[])
  const past = sortEventsForDisplay(pastRaw as Event[]).slice(0, MAX_PAST_IN_CAROUSEL)

  const sourceDocs = [...upcoming, ...past]

  if (sourceDocs.length === 0) {
    return null
  }

  const events = sourceDocs
    .map((doc) => serializeEventForClient(doc, locale))
    .filter((e): e is NonNullable<typeof e> => e !== null)

  if (events.length === 0) {
    return null
  }

  return <EventsCarousel events={events} />
}
