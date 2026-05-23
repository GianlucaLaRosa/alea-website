import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { GameDetailContent } from '@/components/GameDetailContent'
import type { Game } from '@/payload-types'
import { t } from '@/i18n/messages'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { getRequestLocale } from '@/utilities/getRequestLocale'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { serializeGameForClient } from '@/utilities/serializeGameForClient'
import { gameDetailPath, GAMES_LIST_PATH } from '@/utilities/gamesRoutes'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'games',
    depth: 0,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return docs.map((doc) => ({ slug: doc.slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function GiocoPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await queryGameBySlug({ slug: decodedSlug })

  if (!doc) notFound()

  const locale = await getRequestLocale()
  const game = serializeGameForClient(doc, locale)
  if (!game) notFound()

  return (
    <article className="container py-16 pb-24">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link className="hover:text-foreground hover:underline" href={GAMES_LIST_PATH}>
          {t(locale, 'games.detail.back')}
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-foreground">{game.title}</span>
      </nav>
      <GameDetailContent game={game} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const doc = await queryGameBySlug({ slug: decodedSlug })

  if (!doc) {
    const locale = await getRequestLocale()
    return { title: t(locale, 'games.notFound') }
  }

  const locale = await getRequestLocale()
  const title = doc.title
  const description = doc.shortDescription?.trim() || doc.description?.trim().slice(0, 160)

  return {
    title,
    description: description || undefined,
    openGraph: mergeOpenGraph({
      title,
      description: description || undefined,
      url: `${getServerSideURL()}${gameDetailPath(doc.slug)}`,
    }),
  }
}

const queryGameBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const localeOptions = await getPayloadLocaleOptions()

  const result = await payload.find({
    collection: 'games',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    ...localeOptions,
    where: { slug: { equals: slug } },
  })

  return (result.docs?.[0] as Game | undefined) ?? null
})
