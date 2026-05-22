import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { hasRole } from './roles'

export const adminOnly: Access<User> = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}
