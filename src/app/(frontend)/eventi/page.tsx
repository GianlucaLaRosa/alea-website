import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { EventsGrid } from '@/components/EventsGrid/EventsGrid'
import type { Event } from '@/payload-types'
import { serializeEventForClient } from '@/utilities/serializeEventForClient'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: 'Eventi',
  description: 'Tutti gli eventi, passati e futuri.',
  openGraph: mergeOpenGraph({
    title: 'Eventi',
    url: `${getServerSideURL()}/eventi`,
  }),
}

export default async function EventiPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: 'startAt',
  })

  const events = docs
    .map((doc) => serializeEventForClient(doc as Event))
    .filter((e): e is NonNullable<typeof e> => e !== null)

  return (
    <article className="container py-16 pb-24">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">Eventi</h1>
        <p className="mt-3 text-muted-foreground">
          Elenco completo ordinato per data di inizio (dalla più vecchia alla più recente).
        </p>
      </header>
      <EventsGrid events={events} />
    </article>
  )
}
