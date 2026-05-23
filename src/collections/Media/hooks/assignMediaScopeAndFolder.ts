import type { CollectionBeforeChangeHook } from 'payload'

import type { Media } from '@/payload-types'
import {
  allowedMediaScopes,
  canManageSystem,
  type MediaScope,
} from '@/access/roles'
import { resolveMediaFolderId } from '@/hooks/ensureMediaFolders'

function resolveDefaultScope(user: Parameters<CollectionBeforeChangeHook<Media>>[0]['req']['user']): MediaScope {
  const scopes = allowedMediaScopes(user)
  if (!scopes?.length) return 'system'
  return scopes[0]
}

export const assignMediaScopeAndFolder: CollectionBeforeChangeHook<Media> = async ({
  data,
  operation,
  req,
}) => {
  if (!data) return data

  if (canManageSystem(req.user)) {
    const scope = (data.scope as MediaScope | undefined) ?? 'system'
    data.scope = scope
    const folderId = await resolveMediaFolderId(req.payload, scope)
    if (folderId != null) data.folder = folderId
    return data
  }

  const allowed = allowedMediaScopes(req.user)
  if (!allowed?.length) {
    throw new Error('Non hai permesso di caricare media.')
  }

  const requested = data.scope as MediaScope | undefined
  let scope: MediaScope

  if (operation === 'create') {
    scope = requested && allowed.includes(requested) ? requested : resolveDefaultScope(req.user)
  } else {
    const current = (data.scope as MediaScope | undefined) ?? resolveDefaultScope(req.user)
    scope = requested && allowed.includes(requested) ? requested : current
  }

  if (!allowed.includes(scope)) {
    throw new Error(`Non puoi usare media con ambito «${scope}».`)
  }

  data.scope = scope
  const folderId = await resolveMediaFolderId(req.payload, scope)
  if (folderId != null) data.folder = folderId

  return data
}
