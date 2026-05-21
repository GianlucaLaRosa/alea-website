import type { CollectionBeforeChangeHook } from 'payload'

import type { Event, Tag } from '@/payload-types'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'

async function resolveTagTitles(
  tagRefs: Event['tags'],
  req: Parameters<CollectionBeforeChangeHook<Event>>[0]['req'],
): Promise<string> {
  if (!tagRefs?.length) return ''

  const ids = tagRefs
    .map((t) => (typeof t === 'object' && t !== null ? t.id : t))
    .filter((id): id is number => typeof id === 'number')

  if (ids.length === 0) return ''

  const { docs } = await req.payload.find({
    collection: 'tags',
    depth: 0,
    limit: ids.length,
    locale: req.locale,
    fallbackLocale: 'it',
    overrideAccess: false,
    pagination: false,
    req,
    where: { id: { in: ids } },
  })

  return docs.map((t) => (t as Tag).title).join(' ')
}

function readLocalizedString(
  value: string | Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  return (value[locale] ?? value.it ?? Object.values(value)[0] ?? '').trim()
}

export const syncEventSearchText: CollectionBeforeChangeHook<Event> = async ({
  data,
  originalDoc,
  req,
}) => {
  const locale = req.locale ?? 'it'
  const title = readLocalizedString(
    (data.title ?? originalDoc?.title) as string | Record<string, string> | undefined,
    locale,
  )
  const address = readLocalizedString(
    (data.address ?? originalDoc?.address) as string | Record<string, string> | undefined,
    locale,
  )
  const tags = data.tags ?? originalDoc?.tags
  const description = data.description ?? originalDoc?.description

  const tagTitles = await resolveTagTitles(tags, req)
  const descriptionText = lexicalToPlainText(
    description as Parameters<typeof lexicalToPlainText>[0],
  )

  const parts = [title, address, tagTitles, descriptionText].filter(Boolean)
  const searchText = parts.join(' ').toLowerCase()

  const existing =
    typeof data.searchText === 'object' && data.searchText !== null && !Array.isArray(data.searchText)
      ? { ...(data.searchText as Record<string, string>) }
      : typeof originalDoc?.searchText === 'object' &&
          originalDoc.searchText !== null &&
          !Array.isArray(originalDoc.searchText)
        ? { ...(originalDoc.searchText as Record<string, string>) }
        : {}

  ;(data as { searchText?: string | Record<string, string> }).searchText = {
    ...existing,
    [locale]: searchText,
  }

  return data
}
