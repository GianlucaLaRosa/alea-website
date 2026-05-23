import type { LocaleCode } from '@/config/localization'
import type { Game, Media, Tag } from '@/payload-types'
import { GAME_PLACEHOLDER_SRC } from '@/utilities/gamePlaceholder'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { normalizeTagColor } from '@/utilities/tagColorStyles'

export type SerializedGameTag = {
  id: string | number
  title: string
  slug: string
  color: string
}

export type SerializedGameExpansion = {
  name: string
  bggId: number | null
  owned: boolean
}

export type SerializedGameForClient = {
  id: string | number
  slug: string
  bggId: number
  bggUrl: string | null
  title: string
  shortDescription: string
  description: string
  minPlayers: number
  maxPlayers: number
  minPlayTime: number
  maxPlayTime: number
  cardImageSrc: string
  detailImageSrc: string
  heroImageSrc: string | null
  tags: SerializedGameTag[]
  expansions: SerializedGameExpansion[]
  ownedExpansions: SerializedGameExpansion[]
}

function serializeGameTag(tag: number | Tag): SerializedGameTag | null {
  if (typeof tag !== 'object' || !tag.slug) return null
  if (tag.scope && tag.scope !== 'games') return null
  return {
    id: tag.id,
    title: tag.title,
    slug: tag.slug,
    color: normalizeTagColor(tag.color),
  }
}

function mediaSrc(
  upload: number | Media | null | undefined,
  fallback: string = GAME_PLACEHOLDER_SRC,
): string {
  if (upload && typeof upload === 'object' && upload.url) {
    return getMediaUrl(upload.url, upload.updatedAt)
  }
  return fallback
}

export function serializeGameForClient(
  doc: Game,
  _locale: LocaleCode = 'it',
): SerializedGameForClient | null {
  const title = doc.title?.trim()
  if (!title || !doc.slug) return null

  const expansions =
    doc.expansions?.map((row) => ({
      name: row.name ?? '',
      bggId: row.bggId ?? null,
      owned: Boolean(row.owned),
    })) ?? []

  const cardImageSrc = mediaSrc(doc.cardImage)
  const detailImageSrc = mediaSrc(doc.detailImage, cardImageSrc)
  const heroFromMedia = mediaSrc(doc.heroImage, '')
  const heroImageSrc = heroFromMedia && heroFromMedia !== GAME_PLACEHOLDER_SRC ? heroFromMedia : null

  return {
    id: doc.id,
    slug: doc.slug,
    bggId: doc.bggId,
    bggUrl: doc.bggUrl?.trim() || null,
    title,
    shortDescription: doc.shortDescription?.trim() ?? '',
    description: doc.description?.trim() ?? '',
    minPlayers: doc.minPlayers ?? 0,
    maxPlayers: doc.maxPlayers ?? 0,
    minPlayTime: doc.minPlayTime ?? 0,
    maxPlayTime: doc.maxPlayTime ?? 0,
    cardImageSrc,
    detailImageSrc,
    heroImageSrc,
    tags:
      doc.tags
        ?.map((tag) => serializeGameTag(tag))
        .filter((t): t is SerializedGameTag => t !== null) ?? [],
    expansions,
    ownedExpansions: expansions.filter((e) => e.owned),
  }
}
