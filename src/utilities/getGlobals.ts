import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { LocaleCode } from '@/config/localization'
import { getRequestLocale } from '@/utilities/getRequestLocale'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale: LocaleCode,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
    fallbackLocale: 'it',
  })

  return global
}

export async function getCachedGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale?: LocaleCode,
): Promise<DataFromGlobalSlug<T>> {
  const resolvedLocale = locale ?? (await getRequestLocale())

  return unstable_cache(
    async () => getGlobal<T>(slug, depth, resolvedLocale),
    [slug, resolvedLocale, String(depth)],
    {
      tags: [`global_${slug}`],
    },
  )()
}
