'use client'

import * as React from 'react'
import Image from 'next/image'

import { EventDialogBody } from '@/components/EventDialogBody'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { formatEventDateRange } from '@/utilities/formatEventDates'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

export function EventsGrid({ events }: { events: SerializedEventForClient[] }) {
  const [active, setActive] = React.useState<SerializedEventForClient | null>(null)

  if (events.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Non ci sono eventi in archivio. Aggiungine dalla dashboard.
      </p>
    )
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <Card className="flex h-full flex-col overflow-hidden pt-0">
              <div className="relative aspect-[16/10] w-full bg-muted">
                <Image
                  alt={event.imageAlt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={event.imageSrc}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-heading text-lg leading-snug">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatEventDateRange(event.startAt, event.endAt)}
                </p>
                {event.address ? (
                  <p className="text-sm text-muted-foreground">{event.address}</p>
                ) : null}
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Button
                  className="w-full"
                  type="button"
                  variant="secondary"
                  onClick={() => setActive(event)}
                >
                  Dettagli
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
          {active ? <EventDialogBody event={active} /> : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
