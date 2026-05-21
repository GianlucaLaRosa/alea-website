import type { Event } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type SerializedEventForClient = {
  id: string | number
  title: string
  imageSrc: string
  imageAlt: string
  startAt: string
  endAt: string
  address: string
  description: Event['description']
  links: { label: string; url: string }[]
}

export function serializeEventForClient(doc: Event): SerializedEventForClient | null {
  const image = doc.image
  if (typeof image !== 'object' || !image?.url) return null

  const links =
    doc.links?.map((row) => ({
      label: row.label ?? '',
      url: row.url ?? '',
    })) ?? []

  return {
    id: doc.id,
    title: doc.title,
    imageSrc: getMediaUrl(image.url, image.updatedAt),
    imageAlt: image.alt ?? doc.title,
    startAt: typeof doc.startAt === 'string' ? doc.startAt : new Date(doc.startAt).toISOString(),
    endAt: typeof doc.endAt === 'string' ? doc.endAt : new Date(doc.endAt).toISOString(),
    address: doc.address ?? '',
    description: doc.description,
    links,
  }
}
