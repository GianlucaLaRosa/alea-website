import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { canManageEvents as userCanManageEvents } from './roles'

export const canManageEvents: Access<User> = ({ req: { user } }) => {
  return userCanManageEvents(user)
}
