import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Event } from '@/payload-types'

function revalidateEventPaths(slug: string | null | undefined) {
  revalidatePath('/')
  revalidatePath('/eventi')
  if (slug) {
    revalidatePath(`/eventi/${slug}`)
  }
}

export const revalidateEvents: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc._status === 'published') {
    payload.logger.info(`Revalidating event: ${doc.slug ?? doc.id}`)
    revalidateEventPaths(doc.slug)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    payload.logger.info(`Revalidating unpublished event: ${previousDoc.slug ?? previousDoc.id}`)
    revalidateEventPaths(previousDoc.slug)
  }

  return doc
}

export const revalidateEventsDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?._status === 'published') {
    revalidateEventPaths(doc.slug)
  }
}
