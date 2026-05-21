import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { LocaleCode } from '@/config/localization'
import { getRequestLocale } from '@/utilities/getRequestLocale'

type Collection = keyof Config['collections']

async function getDocument(
  collection: Collection,
  slug: string,
  depth: number,
  locale: LocaleCode,
) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    locale,
    fallbackLocale: 'it',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

export async function getCachedDocument(
  collection: Collection,
  slug: string,
  depth = 0,
  locale?: LocaleCode,
) {
  const resolvedLocale = locale ?? (await getRequestLocale())

  return unstable_cache(
    async () => getDocument(collection, slug, depth, resolvedLocale),
    [collection, slug, resolvedLocale, String(depth)],
    {
      tags: [`${collection}_${slug}`],
    },
  )()
}
