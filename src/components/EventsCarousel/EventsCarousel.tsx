'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { EventDialogBody } from '@/components/EventDialogBody'
import { useLocaleContext } from '@/providers/Locale'
import { getEventsCarouselStartIndex } from '@/utilities/getEventsCarouselStartIndex'
import { getMediaObjectPosition } from '@/utilities/getMediaObjectPosition'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

type Props = {
  events: SerializedEventForClient[]
}

function isPastEvent(event: SerializedEventForClient, now = Date.now()): boolean {
  return new Date(event.endAt).getTime() <= now
}

export function EventsCarousel({ events }: Props) {
  const { t, tf } = useLocaleContext()
  const [api, setApi] = React.useState<CarouselApi>()
  const startIndex = React.useMemo(() => getEventsCarouselStartIndex(events), [events])
  const [current, setCurrent] = React.useState(() => startIndex + 1)
  const [dialogEvent, setDialogEvent] = React.useState<SerializedEventForClient | null>(null)

  const totalSlides = 1 + events.length

  React.useEffect(() => {
    if (!api) return

    const sync = () => setCurrent(api.selectedScrollSnap() + 1)
    sync()
    api.on('select', sync)
    return () => {
      api.off('select', sync)
    }
  }, [api])

  return (
    <>
      <section
        aria-label={t('events.carousel.label')}
        className="relative w-full border-b border-border bg-muted/30 py-10 md:py-14"
      >
        <div className="container relative px-10 md:px-16">
          <Carousel
            className="mx-auto w-full max-w-4xl"
            opts={{
              align: 'center',
              containScroll: false,
              loop: false,
              startIndex,
              watchDrag: true,
              watchResize: true,
            }}
            setApi={setApi}
          >
            <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <CarouselContent className="-ml-3 md:-ml-4">
                <CarouselItem className="basis-4/5 pl-3 sm:basis-3/5 md:pl-4 lg:basis-1/2">
                  <Link
                    className={cn(
                      'group relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-background to-primary/5 p-6 text-center shadow-sm transition-[opacity,transform] duration-300',
                      current !== 1 && 'scale-[0.97] opacity-40',
                    )}
                    href="/eventi"
                  >
                    <span className="font-heading text-xl font-medium text-foreground md:text-2xl">
                      {t('events.carousel.allTitle')}
                    </span>
                    <span className="mt-2 max-w-[14rem] text-sm text-muted-foreground md:text-base">
                      {t('events.carousel.allDescription')}
                    </span>
                    <span className="mt-6 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                      {t('events.carousel.cta')}
                    </span>
                  </Link>
                </CarouselItem>
                {events.map((event, index) => {
                  const slideIndex = index + 2
                  const active = current === slideIndex
                  const past = isPastEvent(event)
                  return (
                    <CarouselItem
                      key={event.id}
                      className="basis-4/5 pl-3 sm:basis-3/5 md:pl-4 lg:basis-1/2"
                    >
                      <button
                        className={cn(
                          'group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl border border-border shadow-sm transition-[opacity,transform] duration-300',
                          !active && 'scale-[0.97] opacity-40',
                          past && active && 'opacity-90',
                        )}
                        type="button"
                        onClick={() => setDialogEvent(event)}
                      >
                        <Image
                          alt={event.coverImage.alt}
                          className={cn(
                            'object-cover transition-[transform,opacity,filter] duration-300 group-hover:scale-[1.02]',
                            past && 'opacity-75 saturate-[0.72]',
                          )}
                          fill
                          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                          src={event.coverImage.src}
                          style={{
                            objectPosition: getMediaObjectPosition(
                              event.coverImage.focalX,
                              event.coverImage.focalY,
                            ),
                          }}
                        />
                        <span className="sr-only">
                          {tf('events.detail.openDetails', { title: event.title })}
                        </span>
                      </button>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </div>
            {totalSlides > 1 ? (
              <>
                <CarouselPrevious className="left-1 md:left-2" />
                <CarouselNext className="right-1 md:right-2" />
              </>
            ) : null}
          </Carousel>
        </div>
      </section>

      <Dialog open={dialogEvent !== null} onOpenChange={(open) => !open && setDialogEvent(null)}>
        <DialogContent className="max-h-[min(92vh,900px)] gap-0 overflow-y-auto p-0 sm:max-w-3xl md:max-w-4xl">
          <div className="p-6 sm:p-8">
            {dialogEvent ? <EventDialogBody event={dialogEvent} /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
