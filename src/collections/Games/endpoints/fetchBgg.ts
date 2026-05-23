import { APIError, type Endpoint } from 'payload'

import { canManageGames } from '@/access/roles'
import { importBggMedia } from '@/utilities/bgg/importBggMedia'
import { fetchBggGameByUrlOrId } from '@/utilities/bgg/fetchBggGame'
import { resolveGameTagIds } from '@/utilities/gameTags'

export const fetchBggEndpoint: Endpoint = {
  path: '/fetch-bgg',
  method: 'post',
  handler: async (req) => {
    if (!canManageGames(req.user)) {
      throw new APIError('Unauthorized', 401)
    }

    let body: { url?: string; excludeId?: string | number }
    try {
      body = (await req.json?.()) as { url?: string; excludeId?: string | number }
    } catch {
      body = {}
    }

    const url = body.url?.trim()
    if (!url) {
      throw new APIError('URL BoardGameGeek obbligatorio.', 400)
    }

    const excludeId = body.excludeId

    const result = await fetchBggGameByUrlOrId(url, {
      checkDuplicate: async (bggId) => {
        const found = await req.payload.find({
          collection: 'games',
          depth: 0,
          limit: 1,
          overrideAccess: true,
          pagination: false,
          where: {
            and: [
              { bggId: { equals: bggId } },
              ...(excludeId ? [{ id: { not_equals: excludeId } }] : []),
            ],
          },
        })
        return found.totalDocs > 0
      },
    })

    if (!result.ok) {
      return Response.json(
        {
          ok: false,
          error: result.error,
          expansionHint: result.expansionHint ?? null,
        },
        { status: 422 },
      )
    }

    const { data } = result

    const [tagIds, media] = await Promise.all([
      resolveGameTagIds(req.payload, data.taxonomyNames, req),
      importBggMedia(req, {
        title: data.title,
        bggId: data.bggId,
        cardImageUrl: data.cardImageUrl,
        detailImageUrl: data.detailImageUrl,
        heroImageUrl: data.heroImageUrl,
      }),
    ])

    const warnings = [
      ...result.warnings,
      ...media.imageWarnings.map((message) => ({ field: 'images', message })),
    ]

    return Response.json({
      ok: true,
      data: {
        ...data,
        tagIds,
        cardImageId: media.cardImageId,
        detailImageId: media.detailImageId,
        heroImageId: media.heroImageId,
      },
      warnings,
      duplicate: result.duplicate,
    })
  },
}
