import type { CollectionBeforeValidateHook } from 'payload'

import type { Event } from '@/payload-types'

/** Valori iniziali per la creazione: titolo/slug validi prima del primo autosave. */
export const prepareNewEvent: CollectionBeforeValidateHook<Event> = ({ data, operation }) => {
  if (operation !== 'create' || !data) return data

  if (!data.title?.trim()) {
    data.title = 'Nuovo evento'
  }

  const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  if (!slug) {
    data.slug = `nuovo-evento-${Date.now().toString(36)}`
    ;(data as Event & { generateSlug?: boolean }).generateSlug = false
  }

  return data
}
