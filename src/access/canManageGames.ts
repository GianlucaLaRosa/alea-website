import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { canManageGames as userCanManageGames } from './roles'

export const canManageGames: Access<User> = ({ req: { user } }) => {
  return userCanManageGames(user)
}
