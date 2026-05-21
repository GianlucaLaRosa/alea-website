import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateEvents: CollectionAfterChangeHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    revalidatePath('/eventi')
  }
  return doc
}

export const revalidateEventsDelete: CollectionAfterDeleteHook = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    revalidatePath('/eventi')
  }
}
