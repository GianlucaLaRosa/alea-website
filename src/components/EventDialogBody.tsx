'use client'

import RichText from '@/components/RichText'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'
import { formatEventDateRange } from '@/utilities/formatEventDates'

export function EventDialogBody({ event }: { event: SerializedEventForClient }) {
  const range = formatEventDateRange(event.startAt, event.endAt)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-xl sm:text-2xl">{event.title}</DialogTitle>
        <DialogDescription className="space-y-1 text-left">
          <span className="block">{range}</span>
          {event.address ? <span className="block">{event.address}</span> : null}
        </DialogDescription>
      </DialogHeader>
      {event.description ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <RichText data={event.description} enableGutter={false} />
        </div>
      ) : null}
      {event.links.length > 0 ? (
        <ul className="flex flex-col gap-2 border-t border-border pt-4">
          {event.links.map((link, i) => (
            <li key={`${link.url}-${i}`}>
              <a
                className="text-primary underline-offset-4 hover:underline"
                href={link.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label || link.url}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
