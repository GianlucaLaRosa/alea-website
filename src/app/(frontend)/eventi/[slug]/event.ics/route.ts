import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { generateEventIcs } from '@/utilities/generateEventIcs'
import { getPayloadLocaleOptions } from '@/utilities/getPayloadLocaleOptions'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'
import { getServerSideURL } from '@/utilities/getURL'

type Args = {
  params: Promise<{ slug?: string }>
}

export async function GET(_req: Request, { params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: configPromise })
  const localeOptions = await getPayloadLocaleOptions()

  const result = await payload.find({
    collection: 'events',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    ...localeOptions,
    where: {
      slug: { equals: decodedSlug },
    },
  })

  const doc = result.docs[0]
  if (!doc) {
    return new Response('Not found', { status: 404 })
  }

  const ics = generateEventIcs({
    title: doc.title,
    description: lexicalToPlainText(
      doc.description as Parameters<typeof lexicalToPlainText>[0],
    ),
    startAt:
      typeof doc.startAt === 'string' ? doc.startAt : new Date(doc.startAt).toISOString(),
    endAt: typeof doc.endAt === 'string' ? doc.endAt : new Date(doc.endAt).toISOString(),
    address: doc.address,
    slug: doc.slug ?? String(doc.id),
    siteUrl: getServerSideURL(),
  })

  const filename = `${decodedSlug}.ics`

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
