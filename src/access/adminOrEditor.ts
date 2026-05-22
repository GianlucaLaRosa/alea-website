import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { hasCmsAccess } from './roles'

export const adminOrEditor: Access<User> = ({ req: { user } }) => {
  return hasCmsAccess(user)
}
