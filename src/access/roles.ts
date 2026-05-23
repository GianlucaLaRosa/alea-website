import type { User } from '@/payload-types'

/** Ruoli assegnabili in admin. GDR/WarGame: nessun permesso CMS finché non esistono le collection. */
export type CmsRole =
  | 'admin'
  | 'gdt-specialist'
  | 'gdr-specialist'
  | 'wargame-specialist'
  | 'social-specialist'

export type MediaScope = 'system' | 'games' | 'events' | 'gdr' | 'wargame'

export type TagScope = 'events' | 'games'

/** Ruoli che possono accedere al backoffice (login admin). */
export const CMS_ACCESS_ROLES: CmsRole[] = ['admin', 'gdt-specialist', 'social-specialist']

export const ALL_CMS_ROLES: CmsRole[] = [
  'admin',
  'gdt-specialist',
  'gdr-specialist',
  'wargame-specialist',
  'social-specialist',
]

export const hasRole = (user: User | null | undefined, role: CmsRole): boolean => {
  return Boolean(user?.roles?.includes(role))
}

export const hasAnyRole = (user: User | null | undefined, roles: CmsRole[]): boolean => {
  return Boolean(user?.roles?.some((role) => roles.includes(role as CmsRole)))
}

/** Accesso al pannello admin (login). GDR/WarGame non inclusi finché senza permessi. */
export const hasCmsAccess = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, CMS_ACCESS_ROLES)
}

export const canManageSystem = (user: User | null | undefined): boolean => {
  return hasRole(user, 'admin')
}

export const canManageGames = (user: User | null | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'gdt-specialist')
}

export const canManageEvents = (user: User | null | undefined): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'social-specialist')
}

export const allowedTagScopes = (user: User | null | undefined): TagScope[] | null => {
  if (canManageSystem(user)) return null
  const scopes: TagScope[] = []
  if (canManageGames(user)) scopes.push('games')
  if (canManageEvents(user)) scopes.push('events')
  return scopes
}

export const allowedMediaScopes = (user: User | null | undefined): MediaScope[] | null => {
  if (canManageSystem(user)) return null
  const scopes: MediaScope[] = []
  if (canManageGames(user)) scopes.push('games')
  if (canManageEvents(user)) scopes.push('events')
  return scopes
}

export type TranslationContext = 'games' | 'events' | 'system'

/** Ambiti visibili nella dashboard traduzioni, in base ai ruoli (OR se multipli). */
export const translationContextsForUser = (user: User | null | undefined): TranslationContext[] => {
  if (!user) return []
  const contexts = new Set<TranslationContext>()
  if (canManageSystem(user)) {
    contexts.add('games')
    contexts.add('events')
    contexts.add('system')
  } else {
    if (canManageGames(user)) contexts.add('games')
    if (canManageEvents(user)) contexts.add('events')
  }
  return [...contexts]
}
