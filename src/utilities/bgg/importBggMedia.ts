import type { PayloadRequest } from 'payload'

import { fetchFileByURL } from '@/utilities/fetchFileByURL'

export type BggMediaImportResult = {
  cardImageId: number | null
  detailImageId: number | null
  heroImageId: number | null
  imageWarnings: string[]
}

async function downloadToMedia(
  req: PayloadRequest,
  url: string | undefined,
  filename: string,
  alt: string,
): Promise<{ id: number } | null> {
  const trimmed = url?.trim()
  if (!trimmed) return null

  try {
    const file = await fetchFileByURL(trimmed, filename)
    const media = await req.payload.create({
      collection: 'media',
      data: { alt, scope: 'games' },
      file,
      req,
    })
    return { id: Number(media.id) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    req.payload.logger.warn(`BGG media import failed (${filename}): ${message}`)
    return null
  }
}

/** Scarica le immagini BGG in Media subito (anteprima in admin prima del salvataggio). */
export async function importBggMedia(
  req: PayloadRequest,
  options: {
    title: string
    bggId: number
    cardImageUrl: string
    detailImageUrl: string
    heroImageUrl: string
  },
): Promise<BggMediaImportResult> {
  const { title, bggId, cardImageUrl, detailImageUrl, heroImageUrl } = options
  const imageWarnings: string[] = []

  const card = await downloadToMedia(req, cardImageUrl, `bgg-${bggId}-card`, title)
  if (cardImageUrl && !card) imageWarnings.push('Impossibile scaricare l’immagine card da BGG.')

  const detail = await downloadToMedia(req, detailImageUrl, `bgg-${bggId}-detail`, title)
  if (detailImageUrl && !detail) {
    imageWarnings.push('Impossibile scaricare l’immagine dettaglio da BGG.')
  }

  const hero = await downloadToMedia(req, heroImageUrl, `bgg-${bggId}-hero`, title)
  if (heroImageUrl && !hero) imageWarnings.push('Impossibile scaricare l’immagine hero da BGG.')

  return {
    cardImageId: card?.id ?? null,
    detailImageId: detail?.id ?? null,
    heroImageId: hero?.id ?? null,
    imageWarnings,
  }
}
