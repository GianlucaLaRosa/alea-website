import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import {
  canManageEvents,
  canManageGames,
  canManageSystem,
  hasCmsAccess,
  hasRole,
  type CmsRole,
} from './roles'

type NavUser = { roles?: unknown } | null | undefined

function userRoles(user: NavUser): CmsRole[] {
  const roles = user?.roles
  if (!Array.isArray(roles)) return []
  return roles.filter((role): role is CmsRole => typeof role === 'string')
}

function asUser(user: PayloadRequest['user']): User | null {
  if (!user) return null
  return user as User
}

function hasAdminRole(user: NavUser): boolean {
  return userRoles(user).includes('admin')
}

export const gamesAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return canManageGames(asUser(user))
}

export const eventsAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return canManageEvents(asUser(user))
}

export const tagsAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  const u = asUser(user)
  return canManageSystem(u) || canManageGames(u) || canManageEvents(u)
}

export const mediaAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  const u = asUser(user)
  return canManageSystem(u) || canManageGames(u) || canManageEvents(u)
}

export const usersAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return hasAdminRole(user)
}

export const cmsAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return hasCmsAccess(asUser(user))
}

export function isGamesNavVisible(user: unknown): boolean {
  const roles = userRoles(user as NavUser)
  return roles.includes('admin') || roles.includes('gdt-specialist')
}

export function isEventsNavVisible(user: unknown): boolean {
  const roles = userRoles(user as NavUser)
  return roles.includes('admin') || roles.includes('social-specialist')
}

export function isTagsNavVisible(user: unknown): boolean {
  const roles = userRoles(user as NavUser)
  return (
    roles.includes('admin') ||
    roles.includes('gdt-specialist') ||
    roles.includes('social-specialist')
  )
}

export function isMediaNavVisible(user: unknown): boolean {
  return isTagsNavVisible(user)
}

export function isAdminNavVisible(user: unknown): boolean {
  return hasAdminRole(user as NavUser)
}
