import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Game } from '@/payload-types'
import { GAMES_LIST_PATH } from '@/utilities/gamesRoutes'

export const revalidateGames: CollectionAfterChangeHook<Game> = ({ doc, previousDoc }) => {
  revalidatePath(GAMES_LIST_PATH)
  if (doc.slug) revalidatePath(`${GAMES_LIST_PATH}/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`${GAMES_LIST_PATH}/${previousDoc.slug}`)
  }
  return doc
}

export const revalidateGamesDelete: CollectionAfterDeleteHook<Game> = ({ doc }) => {
  revalidatePath(GAMES_LIST_PATH)
  if (doc.slug) revalidatePath(`${GAMES_LIST_PATH}/${doc.slug}`)
  return doc
}
