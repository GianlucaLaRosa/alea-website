export type BggLink = {
  name?: string | null
  objectid?: string | null
  objecttype?: string | null
}

export type BggGeekItem = {
  objectid?: string | number
  subtype?: string | null
  name?: string | null
  short_description?: string | null
  shortdescription?: string | null
  description?: string | null
  minplayers?: string | number | null
  maxplayers?: string | number | null
  minplaytime?: string | number | null
  maxplaytime?: string | number | null
  images?: {
    square200?: string | null
  } | null
  imageurl?: string | null
  'imageurl@2x'?: string | null
  topimageurl?: string | null
  links?: {
    boardgamecategory?: BggLink[] | null
    boardgamemechanic?: BggLink[] | null
    boardgameexpansion?: BggLink[] | null
    expandsboardgame?: BggLink[] | null
  } | null
}

export type BggGeekItemsResponse = {
  item?: BggGeekItem | null
}

export type BggImportWarning = {
  field: string
  message: string
}

export type BggNormalizedGame = {
  bggId: number
  title: string
  shortDescription: string
  description: string
  minPlayers: number
  maxPlayers: number
  minPlayTime: number
  maxPlayTime: number
  cardImageUrl: string
  detailImageUrl: string
  heroImageUrl: string
  expansions: { name: string; bggId: number | null }[]
  taxonomyNames: string[]
  bggUrl: string
}

export type BggFetchResult =
  | { ok: true; data: BggNormalizedGame; warnings: BggImportWarning[]; duplicate: boolean }
  | { ok: false; error: string; expansionHint?: { baseGameName: string; baseGameBggId: number | null } }
