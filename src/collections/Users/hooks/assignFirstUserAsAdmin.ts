import type { CollectionBeforeChangeHook } from 'payload'

import type { User } from '@/payload-types'

export const assignFirstUserAsAdmin: CollectionBeforeChangeHook<User> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || (data.roles && data.roles.length > 0)) {
    return data
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
  })

  if (totalDocs === 0) {
    data.roles = ['admin']
  }

  return data
}
