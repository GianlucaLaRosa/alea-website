import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { EventDetailContent } from '@/components/EventDetailContent'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Event } from '@/payload-types'
import { t } from '@/i18n/messages'
import { generateMeta } from '@/utilities/generateMeta'
import { eventVisibilityWhere } from '@/utilities/eventVisibilityWhere'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { getRequestLocale } from '@/utilities/getRequestLocale'
import { serializeEventForClient } from '@/utilities/serializeEventForClient'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'events',
    depth: 0,
    draft: false,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: eventVisibilityWhere,
  })

  return docs.map((doc) => ({ slug: doc.slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function EventoPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await queryEventBySlug({ slug: decodedSlug, draft })

  if (!doc) notFound()

  const locale = await getRequestLocale()
  const event = serializeEventForClient(doc, locale)
  if (!event) notFound()

  return (
    <article className="container py-16 pb-24">
      {draft ? <LivePreviewListener /> : null}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link className="hover:text-foreground hover:underline" href="/eventi">
          {t(locale, 'events.detail.back')}
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-foreground">{event.title}</span>
      </nav>
      <EventDetailContent event={event} variant="page" />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await queryEventBySlug({ slug: decodedSlug, draft: false })

  if (!doc) {
    const locale = await getRequestLocale()
    return { title: t(locale, 'events.notFound') }
  }

  return generateMeta({
    doc: {
      meta: doc.meta,
      title: doc.title,
      slug: doc.slug,
    },
    pathPrefix: '/eventi',
  })
}

const queryEventBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })
  const localeOptions = await getPayloadLocaleOptions()

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    ...localeOptions,
    where: draft
      ? { slug: { equals: slug } }
      : {
          and: [{ slug: { equals: slug } }, eventVisibilityWhere],
        },
  })

  return (result.docs?.[0] as Event | undefined) ?? null
})
