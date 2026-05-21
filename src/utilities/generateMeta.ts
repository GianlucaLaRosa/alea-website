import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

type MetaWithImage = {
  title?: string | null
  description?: string | null
  image?: Media | number | null
}

type MetaDoc = {
  meta?: MetaWithImage | null
  title?: string | null
  slug?: string | null
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | MetaDoc | null
  /** Es. `/eventi` per le pagine evento */
  pathPrefix?: string
}): Promise<Metadata> => {
  const { doc, pathPrefix } = args

  const meta = doc?.meta as MetaWithImage | undefined
  const ogImage = getImageURL(meta?.image)

  const title = meta?.title
    ? `${meta.title} | Payload Website Template`
    : doc?.title
      ? `${doc.title} | Payload Website Template`
      : 'Payload Website Template'

  const slug = doc?.slug
  const pageUrl = slug
    ? `${getServerSideURL()}${pathPrefix ?? ''}/${slug}`
    : `${getServerSideURL()}${pathPrefix ?? '/'}`

  return {
    description: meta?.description ?? undefined,
    openGraph: mergeOpenGraph({
      description: meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: pageUrl,
    }),
    title,
  }
}
