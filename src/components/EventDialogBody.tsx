'use client'

import { EventDetailContent } from '@/components/EventDetailContent'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

export function EventDialogBody({ event }: { event: SerializedEventForClient }) {
  return <EventDetailContent event={event} variant="modal" />
}
