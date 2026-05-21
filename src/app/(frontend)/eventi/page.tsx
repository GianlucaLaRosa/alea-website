import type { Metadata } from 'next'
import { Suspense } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { EventsListing } from '@/components/EventsListing'
import { EventsPeriodFilter } from '@/components/EventsPeriodFilter'
import { isEventsPeriod, type EventsPeriod } from '@/utilities/eventsPeriod'
import type { Event } from '@/payload-types'
import { buildEventsListWhere } from '@/utilities/buildEventsListWhere'
import { EVENTS_PAGE_SIZE } from '@/utilities/eventiSearchParams'
import { serializeEventForClient } from '@/utilities/serializeEventForClient'
import { formatMessage, t } from '@/i18n/messages'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { getRequestLocale } from '@/utilities/getRequestLocale'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const title = t(locale, 'events.title')

  return {
    title,
    description: t(locale, 'events.description'),
    openGraph: mergeOpenGraph({
      title,
      url: `${getServerSideURL()}/eventi`,
    }),
  }
}

type PageProps = {
  searchParams: Promise<{ period?: string; q?: string; page?: string }>
}

function parsePeriod(periodParam: string | undefined): EventsPeriod {
  return isEventsPeriod(periodParam) ? periodParam : 'upcoming'
}

function parsePage(pageParam: string | undefined): number {
  const n = Number.parseInt(pageParam ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function EventiPage({ searchParams: searchParamsPromise }: PageProps) {
  const { period: periodParam, q: qParam, page: pageParam } = await searchParamsPromise

  const period = parsePeriod(periodParam)
  const q = qParam?.trim() ?? ''
  const page = parsePage(pageParam)

  const payload = await getPayload({ config: configPromise })
  const [locale, localeOptions] = await Promise.all([getRequestLocale(), getPayloadLocaleOptions()])
  const now = new Date().toISOString()

  const where = buildEventsListWhere({
    now,
    period,
    query: q,
  })

  const sort = period === 'past' ? '-featured,-startAt' : '-featured,startAt'

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    draft: false,
    limit: EVENTS_PAGE_SIZE,
    overrideAccess: false,
    page,
    pagination: true,
    sort,
    where,
    ...localeOptions,
  })

  const events = result.docs
    .map((doc) => serializeEventForClient(doc as Event, locale))
    .filter((e): e is NonNullable<typeof e> => e !== null)

  const totalPages = result.totalPages ?? 1
  const totalDocs = result.totalDocs ?? 0
  const currentPage = result.page ?? page

  const periodLabels: Record<EventsPeriod, string> = {
    all: t(locale, 'events.all'),
    upcoming: t(locale, 'events.upcoming'),
    past: t(locale, 'events.past'),
  }

  const headerSuffix = q
    ? ` — «${q}» (${formatMessage(locale, 'events.search.found', { count: totalDocs })})`
    : t(locale, 'events.list.suffix')

  const listParams = {
    period,
    q: q || null,
    page: currentPage,
  }

  return (
    <article className="container py-16 pb-24">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">{t(locale, 'events.title')}</h1>
        <p className="mt-3 text-muted-foreground">
          {periodLabels[period]}
          {headerSuffix}
        </p>
      </header>
      <Suspense fallback={null}>
        <EventsPeriodFilter />
      </Suspense>
      <Suspense fallback={null}>
        <EventsListing
          events={events}
          listParams={listParams}
          page={currentPage}
          searchQuery={q}
          totalDocs={totalDocs}
          totalPages={totalPages}
        />
      </Suspense>
    </article>
  )
}
