import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { adminOnly } from './adminOnly'

export const adminOrSelf: Access<User> = (args) => {
  if (adminOnly(args)) return true

  const { user } = args.req
  if (!user) return false

  return {
    id: {
      equals: user.id,
    },
  }
}
