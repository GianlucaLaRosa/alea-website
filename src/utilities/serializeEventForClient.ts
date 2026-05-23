import type { LocaleCode } from '@/config/localization'
import { t } from '@/i18n/messages'
import type { Event, Tag } from '@/payload-types'
import type { EventStatus } from '@/utilities/eventStatus'
import {
  serializeMediaForClient,
  serializeMediaListForClient,
  type SerializedMediaForClient,
} from '@/utilities/serializeMediaForClient'
import { normalizeTagColor } from '@/utilities/tagColorStyles'

export type SerializedEventTag = {
  id: string | number
  title: string
  slug: string
  color: string
}

export type SerializedEventForClient = {
  id: string | number
  slug: string
  title: string
  featured: boolean
  status: EventStatus
  coverImage: SerializedMediaForClient
  gallery: SerializedMediaForClient[]
  tags: SerializedEventTag[]
  startAt: string
  endAt: string
  address: string
  latitude: number | null
  longitude: number | null
  description: Event['description']
  ticketUrl: string
  ticketLabel: string
  links: { label: string; url: string }[]
}

function serializeEventTag(tag: number | Tag): SerializedEventTag | null {
  if (typeof tag !== 'object' || !tag.slug) return null
  if (tag.scope && tag.scope !== 'events') return null
  return {
    id: tag.id,
    title: tag.title,
    slug: tag.slug,
    color: normalizeTagColor(tag.color),
  }
}

export function serializeEventForClient(
  doc: Event,
  locale: LocaleCode = 'it',
): SerializedEventForClient | null {
  const cover = serializeMediaForClient(doc.coverImage, doc.title)
  if (!cover) return null

  const links =
    doc.links?.map((row) => ({
      label: row.label ?? '',
      url: row.url ?? '',
    })) ?? []

  const tags =
    doc.tags
      ?.map((t) => serializeEventTag(t))
      .filter((t): t is SerializedEventTag => t !== null) ?? []

  const status = (doc.status ?? 'scheduled') as EventStatus

  return {
    id: doc.id,
    slug: doc.slug ?? String(doc.id),
    title: doc.title,
    featured: Boolean(doc.featured),
    status,
    coverImage: cover,
    gallery: serializeMediaListForClient(doc.gallery, doc.title),
    tags,
    startAt: typeof doc.startAt === 'string' ? doc.startAt : new Date(doc.startAt).toISOString(),
    endAt: typeof doc.endAt === 'string' ? doc.endAt : new Date(doc.endAt).toISOString(),
    address: doc.address ?? '',
    latitude: doc.latitude ?? null,
    longitude: doc.longitude ?? null,
    description: doc.description,
    ticketUrl: doc.ticketUrl ?? '',
    ticketLabel: doc.ticketLabel?.trim() || t(locale, 'events.ticket.default'),
    links,
  }
}
