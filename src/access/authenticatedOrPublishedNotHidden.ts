import type { Access, Where } from 'payload'

import { canManageEvents } from './canManageEvents'

/** Pubblico: solo bozze pubblicate e non nascoste. Admin/social specialist: tutto. */
export const authenticatedOrPublishedNotHidden: Access = (args) => {
  if (canManageEvents(args)) return true

  const constraint: Where = {
    and: [
      { _status: { equals: 'published' } },
      { hidden: { not_equals: true } },
    ],
  }

  return constraint
}
