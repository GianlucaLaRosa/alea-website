import type { Payload } from 'payload'

import type { MediaScope } from '@/access/roles'

export const MEDIA_FOLDER_NAMES: Record<MediaScope, string> = {
  system: 'Sistema',
  games: 'Giochi',
  events: 'Eventi',
  gdr: 'GDR',
  wargame: 'WarGame',
}

/** Crea le cartelle media di default se mancanti. */
export async function ensureMediaFolders(payload: Payload): Promise<void> {
  for (const name of Object.values(MEDIA_FOLDER_NAMES)) {
    try {
      const { totalDocs } = await payload.find({
        collection: 'payload-folders',
        depth: 0,
        limit: 0,
        where: { name: { equals: name } },
      })

      if (totalDocs > 0) continue

      await payload.create({
        collection: 'payload-folders',
        data: {
          name,
          folderType: ['media'],
        },
        depth: 0,
      })
    } catch (err) {
      payload.logger.warn(`[media-folders] Impossibile creare cartella «${name}»: ${String(err)}`)
    }
  }
}

export async function resolveMediaFolderId(
  payload: Payload,
  scope: MediaScope,
): Promise<number | null> {
  const name = MEDIA_FOLDER_NAMES[scope]
  const { docs } = await payload.find({
    collection: 'payload-folders',
    depth: 0,
    limit: 1,
    where: { name: { equals: name } },
  })
  const id = docs[0]?.id
  return typeof id === 'number' ? id : null
}
