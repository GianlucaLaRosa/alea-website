import type { CollectionBeforeChangeHook, Where } from 'payload'

import type { Event } from '@/payload-types'

/** Evita conflitti quando più bozze partono da «Nuovo evento» → slug `nuovo-evento`. */
export const ensureUniqueEventSlug: CollectionBeforeChangeHook<Event> = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  if (!slug) return data

  const where: Where = {
    slug: { equals: slug },
  }

  if (operation === 'update' && originalDoc?.id != null) {
    where.id = { not_equals: originalDoc.id }
  }

  const { totalDocs } = await req.payload.find({
    collection: 'events',
    depth: 0,
    limit: 1,
    where,
  })

  if (totalDocs > 0) {
    data.slug = `${slug}-${Date.now().toString(36)}`
  }

  return data
}
