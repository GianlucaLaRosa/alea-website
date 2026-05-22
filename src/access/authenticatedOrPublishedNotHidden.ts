import type { Access, Where } from 'payload'

import { adminOrEditor } from './adminOrEditor'

/** Pubblico: solo bozze pubblicate e non nascoste. Admin/editor: tutto. */
export const authenticatedOrPublishedNotHidden: Access = (args) => {
  if (adminOrEditor(args)) return true

  const constraint: Where = {
    and: [
      { _status: { equals: 'published' } },
      { hidden: { not_equals: true } },
    ],
  }

  return constraint
}
