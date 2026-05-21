import type { Access, Where } from 'payload'

/** Pubblico: solo bozze pubblicate e non nascoste. Admin: tutto. */
export const authenticatedOrPublishedNotHidden: Access = ({ req: { user } }) => {
  if (user) return true

  const constraint: Where = {
    and: [
      { _status: { equals: 'published' } },
      { hidden: { not_equals: true } },
    ],
  }

  return constraint
}
