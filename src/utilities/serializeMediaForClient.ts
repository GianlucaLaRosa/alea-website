import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type SerializedMediaForClient = {
  id: string | number
  src: string
  alt: string
  focalX: number | null
  focalY: number | null
}

export function serializeMediaForClient(
  media: number | Media | null | undefined,
  fallbackAlt = '',
): SerializedMediaForClient | null {
  if (typeof media !== 'object' || !media?.url) return null

  return {
    id: media.id,
    src: getMediaUrl(media.url, media.updatedAt),
    alt: media.alt ?? fallbackAlt,
    focalX: media.focalX ?? null,
    focalY: media.focalY ?? null,
  }
}

export function serializeMediaListForClient(
  items: (number | Media)[] | null | undefined,
  fallbackAlt = '',
): SerializedMediaForClient[] {
  if (!items?.length) return []

  return items
    .map((item) => serializeMediaForClient(item, fallbackAlt))
    .filter((m): m is SerializedMediaForClient => m !== null)
}
