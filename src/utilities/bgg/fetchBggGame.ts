import { normalizeBggItem } from './normalizeBggItem'
import { parseBggObjectId } from './parseBggUrl'
import type { BggFetchResult, BggGeekItemsResponse } from './types'

const BGG_API_BASE = 'https://boardgamegeek.com/api/geekitems'

export async function fetchBggGameByUrlOrId(
  input: string,
  options?: { checkDuplicate?: (bggId: number) => Promise<boolean> },
): Promise<BggFetchResult> {
  const objectId = parseBggObjectId(input)
  if (!objectId) {
    return {
      ok: false,
      error:
        'URL o ID non valido. Esempio: https://boardgamegeek.com/boardgame/143519/quantum oppure 143519',
    }
  }

  let response: Response
  try {
    response = await fetch(`${BGG_API_BASE}?objecttype=thing&objectid=${objectId}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    })
  } catch {
    return { ok: false, error: 'Impossibile contattare BoardGameGeek. Riprova più tardi.' }
  }

  if (!response.ok) {
    return {
      ok: false,
      error: `BoardGameGeek ha risposto con errore ${response.status}.`,
    }
  }

  let json: BggGeekItemsResponse
  try {
    json = (await response.json()) as BggGeekItemsResponse
  } catch {
    return { ok: false, error: 'Risposta BGG non valida.' }
  }

  const item = json.item
  if (!item) {
    return { ok: false, error: 'Gioco non trovato su BoardGameGeek.' }
  }

  const duplicate = options?.checkDuplicate ? await options.checkDuplicate(objectId) : false

  return normalizeBggItem(item, { duplicate })
}
