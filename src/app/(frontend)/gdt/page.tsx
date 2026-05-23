import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { GamesListing } from '@/components/GamesListing'
import type { Game } from '@/payload-types'
import { t } from '@/i18n/messages'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { getRequestLocale } from '@/utilities/getRequestLocale'
import { getServerSideURL } from '@/utilities/getURL'
import { GAMES_LIST_PATH } from '@/utilities/gamesRoutes'
import { serializeGameForClient } from '@/utilities/serializeGameForClient'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const title = t(locale, 'games.title')

  return {
    title,
    description: t(locale, 'games.description'),
    openGraph: mergeOpenGraph({
      title,
      url: `${getServerSideURL()}${GAMES_LIST_PATH}`,
    }),
  }
}

export default async function GiochiPage() {
  const payload = await getPayload({ config: configPromise })
  const [locale, localeOptions] = await Promise.all([getRequestLocale(), getPayloadLocaleOptions()])

  const result = await payload.find({
    collection: 'games',
    depth: 2,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    /** Ordinamento fisso A–Z per titolo (nessun controllo in UI). */
    sort: 'title',
    ...localeOptions,
  })

  const games = result.docs
    .map((doc) => serializeGameForClient(doc as Game, locale))
    .filter((g): g is NonNullable<typeof g> => g !== null)

  return (
    <article className="container py-16 pb-24">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">{t(locale, 'games.title')}</h1>
        <p className="mt-3 text-muted-foreground">{t(locale, 'games.description')}</p>
      </header>
      <GamesListing games={games} />
    </article>
  )
}
