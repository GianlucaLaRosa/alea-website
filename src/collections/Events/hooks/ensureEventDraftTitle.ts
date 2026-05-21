import type { CollectionBeforeChangeHook } from 'payload'

import type { Event } from '@/payload-types'

const DRAFT_TITLE_PLACEHOLDER = 'Nuovo evento'

/** Evita che in admin compaia l'id numerico quando il titolo è ancora vuoto. */
export const ensureEventDraftTitle: CollectionBeforeChangeHook<Event> = ({
  data,
  originalDoc,
}) => {
  const title = (data.title ?? originalDoc?.title ?? '').trim()
  if (!title) {
    data.title = DRAFT_TITLE_PLACEHOLDER
  }
  return data
}
