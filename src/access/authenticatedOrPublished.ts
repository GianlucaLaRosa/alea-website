import type { Access } from 'payload'

import { adminOnly } from './adminOnly'

/** Pubblico: solo bozze con `_status` published (Pages, Posts). Admin: tutto. */
export const authenticatedOrPublished: Access = (args) => {
  if (adminOnly(args)) return true
  return { _status: { equals: 'published' } }
}
