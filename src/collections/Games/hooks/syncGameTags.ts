import type { CollectionBeforeChangeHook } from 'payload'

import type { Game } from '@/payload-types'
import { resolveGameTagIds } from '@/utilities/gameTags'

/** Fallback: collega tag da tassonomia BGG se salvata senza passare dall’import. */
export const syncGameTags: CollectionBeforeChangeHook<Game> = async ({ data, req }) => {
  const names = data?.bggTaxonomy
    ?.map((row) => row?.name?.trim())
    .filter((name): name is string => Boolean(name))

  if (!names?.length) return data

  const tagIds = await resolveGameTagIds(req.payload, names, req)

  const existing = (data.tags ?? [])
    .map((tag) => (typeof tag === 'object' ? tag.id : tag))
    .filter((id): id is number => typeof id === 'number')

  data.tags = [...new Set([...existing, ...tagIds])]
  delete data.bggTaxonomy

  return data
}
