import Image from 'next/image'
import Link from 'next/link'

import { EventStatusBadge } from '@/components/EventStatusBadge'
import { HighlightMatch } from '@/components/HighlightMatch'
import { TagBadge } from '@/components/TagBadge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocaleContext } from '@/providers/Locale'
import { formatEventDateRange } from '@/utilities/formatEventDates'
import { getMediaObjectPosition } from '@/utilities/getMediaObjectPosition'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'

type Props = {
  events: SerializedEventForClient[]
  searchQuery?: string
}

export function EventsGrid({ events, searchQuery = '' }: Props) {
  const { locale, t } = useLocaleContext()

  if (events.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        {searchQuery.trim() ? t('events.search.noResults') : t('events.empty.filters')}
      </p>
    )
  }

  const query = searchQuery.trim()

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id}>
          <Card className="flex h-full flex-col overflow-hidden pt-0">
            <Link className="relative aspect-[16/10] w-full bg-muted" href={`/eventi/${event.slug}`}>
              {event.featured ? (
                <span className="event-featured-badge">In evidenza</span>
              ) : null}
              <Image
                alt={event.coverImage.alt}
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={event.coverImage.src}
                style={{
                  objectPosition: getMediaObjectPosition(
                    event.coverImage.focalX,
                    event.coverImage.focalY,
                  ),
                }}
              />
            </Link>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="font-heading text-lg leading-snug">
                  <Link className="hover:underline" href={`/eventi/${event.slug}`}>
                    <HighlightMatch query={query} text={event.title} />
                  </Link>
                </CardTitle>
                <EventStatusBadge status={event.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {formatEventDateRange(event.startAt, event.endAt, locale)}
              </p>
              {event.address ? (
                <p className="text-sm text-muted-foreground">
                  <HighlightMatch query={query} text={event.address} />
                </p>
              ) : null}
              {event.tags.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {event.tags.map((tag) => (
                    <li key={tag.id}>
                      <TagBadge color={tag.color} highlightQuery={query}>
                        {tag.title}
                      </TagBadge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter>
              <Link
                className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
                href={`/eventi/${event.slug}`}
              >
                {t('events.card.details')}
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  )
}
