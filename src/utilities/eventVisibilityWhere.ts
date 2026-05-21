import type { Where } from 'payload'

/** Esclude eventi con "Nascondi" attivo dalle liste pubbliche. */
export const eventVisibilityWhere: Where = {
  hidden: {
    not_equals: true,
  },
}
