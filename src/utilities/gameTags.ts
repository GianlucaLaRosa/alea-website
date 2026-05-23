import type { Payload, PayloadRequest } from 'payload'

import { DEFAULT_LOCALE } from '@/config/localization'
import type { Tag } from '@/payload-types'
import { randomTagColor } from '@/utilities/randomTagColor'

export function slugifyTagName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'tag'
}

type PayloadLike = Payload | PayloadRequest['payload']

export async function findOrCreateGameTag(
  payload: PayloadLike,
  name: string,
  req?: PayloadRequest,
): Promise<number> {
  const existing = await payload.find({
    collection: 'tags',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [{ scope: { equals: 'games' } }, { title: { equals: name } }],
    },
    locale: DEFAULT_LOCALE,
  })

  const doc = existing.docs[0] as Tag | undefined
  if (doc?.id) return Number(doc.id)

  const created = await payload.create({
    collection: 'tags',
    data: {
      title: name,
      color: randomTagColor(),
      scope: 'games',
      slug: slugifyTagName(name),
      generateSlug: true,
    },
    locale: DEFAULT_LOCALE,
    req,
  })

  return Number(created.id)
}

export async function resolveGameTagIds(
  payload: PayloadLike,
  names: string[],
  req?: PayloadRequest,
): Promise<number[]> {
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
  const ids: number[] = []
  for (const name of unique) {
    ids.push(await findOrCreateGameTag(payload, name, req))
  }
  return ids
}
