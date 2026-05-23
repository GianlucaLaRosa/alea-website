import type {
  BggFetchResult,
  BggGeekItem,
  BggImportWarning,
  BggNormalizedGame,
} from './types'
import { stripHtml } from './stripHtml'

function parsePositiveInt(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function linkNames(links: { name?: string | null }[] | null | undefined): string[] {
  if (!links?.length) return []
  return links
    .map((l) => l.name?.trim())
    .filter((name): name is string => Boolean(name))
}

export function normalizeBggItem(
  item: BggGeekItem,
  options: { duplicate: boolean },
): BggFetchResult {
  const subtype = item.subtype?.trim().toLowerCase() ?? ''

  if (subtype === 'boardgameexpansion') {
    const base = item.links?.expandsboardgame?.[0]
    return {
      ok: false,
      error:
        'Questo elemento è un\'espansione. Apri il gioco base e aggiungi l\'espansione da lì.',
      expansionHint: {
        baseGameName: base?.name?.trim() || 'gioco base',
        baseGameBggId: base?.objectid ? parsePositiveInt(base.objectid) : null,
      },
    }
  }

  if (subtype && subtype !== 'boardgame') {
    return {
      ok: false,
      error: `Tipo BGG non supportato: «${subtype}». Usa l'URL di un gioco da tavolo.`,
    }
  }

  const bggId = parsePositiveInt(item.objectid)
  if (!bggId) {
    return { ok: false, error: 'ID BGG mancante nella risposta API.' }
  }

  const title = item.name?.trim()
  if (!title) {
    return { ok: false, error: 'Nome del gioco non trovato su BoardGameGeek.' }
  }

  const warnings: BggImportWarning[] = []

  const minPlayers = parsePositiveInt(item.minplayers)
  const maxPlayers = parsePositiveInt(item.maxplayers)
  if (minPlayers === null) {
    warnings.push({ field: 'minPlayers', message: 'Numero minimo giocatori non disponibile su BGG.' })
  }
  if (maxPlayers === null) {
    warnings.push({ field: 'maxPlayers', message: 'Numero massimo giocatori non disponibile su BGG.' })
  }

  const minPlayTime = parsePositiveInt(item.minplaytime)
  const maxPlayTime = parsePositiveInt(item.maxplaytime)
  if (minPlayTime === null) {
    warnings.push({ field: 'minPlayTime', message: 'Durata minima non disponibile su BGG.' })
  }
  if (maxPlayTime === null) {
    warnings.push({ field: 'maxPlayTime', message: 'Durata massima non disponibile su BGG.' })
  }

  const shortRaw = item.short_description ?? item.shortdescription ?? ''
  const shortDescription = shortRaw.trim()
  if (!shortDescription) {
    warnings.push({
      field: 'shortDescription',
      message: 'Descrizione breve non disponibile su BGG.',
    })
  }

  const descriptionRaw = item.description ?? ''
  const description = stripHtml(descriptionRaw)
  if (!description) {
    warnings.push({
      field: 'description',
      message: 'Descrizione completa non disponibile su BGG.',
    })
  }

  const cardImageUrl = item.images?.square200?.trim() ?? ''
  const detailImageUrl = item['imageurl@2x']?.trim() ?? item.imageurl?.trim() ?? ''
  const heroImageUrl = item.topimageurl?.trim() ?? ''

  if (!cardImageUrl) {
    warnings.push({ field: 'cardImage', message: 'Immagine card non disponibile su BGG.' })
  }
  if (!detailImageUrl) {
    warnings.push({ field: 'detailImage', message: 'Immagine dettaglio non disponibile su BGG.' })
  }
  if (!heroImageUrl) {
    warnings.push({ field: 'heroImage', message: 'Immagine hero non disponibile su BGG.' })
  }

  const categoryNames = linkNames(item.links?.boardgamecategory)
  const mechanicNames = linkNames(item.links?.boardgamemechanic)
  const taxonomyNames = [...new Set([...categoryNames, ...mechanicNames])]

  const expansions =
    item.links?.boardgameexpansion?.map((exp) => ({
      name: exp.name?.trim() || 'Espansione senza nome',
      bggId: exp.objectid ? parsePositiveInt(exp.objectid) : null,
      owned: false,
    })) ?? []

  const data: BggNormalizedGame = {
    bggId,
    title,
    shortDescription,
    description,
    minPlayers: minPlayers ?? 0,
    maxPlayers: maxPlayers ?? minPlayers ?? 0,
    minPlayTime: minPlayTime ?? 0,
    maxPlayTime: maxPlayTime ?? minPlayTime ?? 0,
    cardImageUrl,
    detailImageUrl,
    heroImageUrl,
    expansions: expansions.map(({ name, bggId: expId }) => ({ name, bggId: expId })),
    taxonomyNames,
    bggUrl: `https://boardgamegeek.com/boardgame/${bggId}`,
  }

  return { ok: true, data, warnings, duplicate: options.duplicate }
}
