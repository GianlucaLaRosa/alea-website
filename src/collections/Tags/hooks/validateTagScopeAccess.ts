import type { CollectionBeforeChangeHook } from 'payload'

import type { Tag } from '@/payload-types'
import { allowedTagScopes, canManageSystem, type TagScope } from '@/access/roles'

export const validateTagScopeAccess: CollectionBeforeChangeHook<Tag> = ({ data, req, operation }) => {
  if (!data || canManageSystem(req.user)) return data

  const allowed = allowedTagScopes(req.user)
  if (!allowed?.length) {
    throw new Error('Non hai permesso di gestire i tag.')
  }

  const scope = data.scope as TagScope | undefined

  if (operation === 'create') {
    if (!scope || !allowed.includes(scope)) {
      if (allowed.length === 1) {
        data.scope = allowed[0]
      } else {
        throw new Error(`Puoi creare tag solo per: ${allowed.join(', ')}.`)
      }
    }
  }

  if (operation === 'update' && scope && !allowed.includes(scope)) {
    throw new Error(`Non puoi spostare un tag nell’ambito «${scope}».`)
  }

  return data
}
