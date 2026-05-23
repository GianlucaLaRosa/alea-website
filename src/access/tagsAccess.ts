import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { allowedTagScopes, canManageSystem } from './roles'

const canMutateTags = (user: User | null | undefined): boolean => {
  const scopes = allowedTagScopes(user)
  return scopes === null || scopes.length > 0
}

export const tagsCreate: Access<User> = ({ req: { user } }) => {
  return canMutateTags(user)
}

export const tagsRead: Access<User> = ({ req: { user } }) => {
  if (!user) return true
  if (canManageSystem(user)) return true
  const scopes = allowedTagScopes(user)
  if (!scopes?.length) return false
  return { scope: { in: scopes } }
}

export const tagsUpdate: Access<User> = ({ req: { user } }) => {
  if (canManageSystem(user)) return true
  const scopes = allowedTagScopes(user)
  if (!scopes?.length) return false
  return { scope: { in: scopes } }
}

export const tagsDelete: Access<User> = tagsUpdate

export const tagsAdmin: Access<User> = ({ req: { user } }) => {
  return canMutateTags(user)
}
