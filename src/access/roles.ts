import type { User } from '@/payload-types'

export type CmsRole = 'admin' | 'editor'

const CMS_ROLES: CmsRole[] = ['admin', 'editor']

export const hasRole = (user: User | null | undefined, role: CmsRole): boolean => {
  return Boolean(user?.roles?.includes(role))
}

export const hasCmsAccess = (user: User | null | undefined): boolean => {
  return Boolean(user?.roles?.some((role) => CMS_ROLES.includes(role as CmsRole)))
}
