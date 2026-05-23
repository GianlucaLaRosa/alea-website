import type { Access } from 'payload'

import type { User } from '@/payload-types'

import { allowedMediaScopes, canManageSystem } from './roles'

export const mediaCreate: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (canManageSystem(user)) return true
  const scopes = allowedMediaScopes(user)
  return Boolean(scopes?.length)
}

/** Lettura pubblica anonima; specialisti e admin vedono solo i propri ambiti in admin. */
export const mediaRead: Access<User> = ({ req: { user } }) => {
  if (!user) return true
  if (canManageSystem(user)) return true
  const scopes = allowedMediaScopes(user)
  if (!scopes?.length) return false
  return { scope: { in: scopes } }
}

export const mediaUpdate: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (canManageSystem(user)) return true
  const scopes = allowedMediaScopes(user)
  if (!scopes?.length) return false
  return { scope: { in: scopes } }
}

export const mediaDelete: Access<User> = mediaUpdate

export const mediaAdmin: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (canManageSystem(user)) return true
  return Boolean(allowedMediaScopes(user)?.length)
}
