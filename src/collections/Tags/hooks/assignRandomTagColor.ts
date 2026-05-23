import type { CollectionBeforeChangeHook } from 'payload'

import type { Tag } from '@/payload-types'
import { randomTagColor } from '@/utilities/randomTagColor'

/** Colore casuale alla creazione; l’utente può modificarlo con il color picker. */
export const assignRandomTagColor: CollectionBeforeChangeHook<Tag> = async ({ data, operation }) => {
  if (operation === 'create' && !data.color?.trim()) {
    data.color = randomTagColor()
  }
  return data
}
