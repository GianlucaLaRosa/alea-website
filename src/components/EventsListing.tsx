'use client'

import { EventsGrid } from '@/components/EventsGrid/EventsGrid'
import { EventsPagination } from '@/components/EventsPagination'
import { EventsSearch } from '@/components/EventsSearch'
import type { EventiListParams } from '@/utilities/eventiSearchParams'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

type Props = {
  events: SerializedEventForClient[]
  searchQuery: string
  page: number
  totalPages: number
  totalDocs: number
  listParams: EventiListParams
}

export function EventsListing({
  events,
  searchQuery,
  page,
  totalPages,
  totalDocs,
  listParams,
}: Props) {
  return (
    <>
      <EventsSearch totalDocs={totalDocs} />
      <EventsGrid events={events} searchQuery={searchQuery} />
      <EventsPagination listParams={listParams} page={page} totalPages={totalPages} />
    </>
  )
}
