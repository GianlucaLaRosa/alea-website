'use client'

import Image from 'next/image'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { EventGalleryStrip } from '@/components/EventGalleryStrip'
import { TagBadge } from '@/components/TagBadge'
import { EventLocationMap } from '@/components/EventLocationMap'
import { EventStatusBadge } from '@/components/EventStatusBadge'
import { buttonVariants } from '@/components/ui/button'
import { useLocaleContext } from '@/providers/Locale'
import { formatEventSchedule } from '@/utilities/formatEventSchedule'
import { getMediaObjectPosition } from '@/utilities/getMediaObjectPosition'
import type { SerializedEventForClient } from '@/utilities/serializeEventForClient'
import { cn } from '@/utilities/ui'

type Props = {
  readonly event: SerializedEventForClient
  readonly variant?: 'page' | 'modal'
  readonly showCover?: boolean
}

export function EventDetailContent({ event, variant = 'page', showCover = true }: Props) {
  const { locale, t } = useLocaleContext()
  const schedule = formatEventSchedule(event.startAt, event.endAt, locale)
  const isModal = variant === 'modal'
  const canBook = Boolean(event.ticketUrl) && event.status !== 'cancelled'
  const ticketDisabled = event.status === 'sold_out'
  const hasMap =
    (event.latitude != null && event.longitude != null) || Boolean(event.address?.trim())

  return (
    <div className={cn('flex flex-col', isModal ? 'gap-6' : 'gap-10')}>
      {showCover ? (
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-xl bg-muted',
            isModal ? 'aspect-[16/9] max-h-[min(42vh,360px)]' : 'aspect-[21/9] max-h-[min(50vh,480px)]',
          )}
        >
          <Image
            alt={event.coverImage.alt}
            className="object-cover"
            fill
            priority={variant === 'page'}
            sizes={
              isModal
                ? '(max-width: 1024px) 90vw, 896px'
                : '(max-width: 1024px) 100vw, 1200px'
            }
            src={event.coverImage.src}
            style={{
              objectPosition: getMediaObjectPosition(
                event.coverImage.focalX,
                event.coverImage.focalY,
              ),
            }}
          />
        </div>
      ) : null}

      <div className={cn('space-y-4', isModal && 'px-0')}>
        <div className="flex flex-wrap items-start gap-3">
          <h1
            className={cn(
              'min-w-0 flex-1 font-heading tracking-tight',
              isModal ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl',
            )}
          >
            {event.title}
          </h1>
          <EventStatusBadge status={event.status} />
        </div>

        {event.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <li key={tag.id}>
                <TagBadge
                  color={tag.color}
                  href={`/eventi?tag=${encodeURIComponent(tag.slug)}`}
                >
                  {tag.title}
                </TagBadge>
              </li>
            ))}
          </ul>
        ) : null}

        {canBook ? (
          <div className="flex flex-wrap gap-3">
            {ticketDisabled ? (
              <span
                className={cn(
                  buttonVariants({ variant: 'secondary' }),
                  'pointer-events-none opacity-60',
                )}
              >
                {event.ticketLabel}
                {t('events.detail.soldOutSuffix')}
              </span>
            ) : (
              <a
                className={buttonVariants({ variant: 'default' })}
                href={event.ticketUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {event.ticketLabel}
              </a>
            )}
          </div>
        ) : null}

        {event.description ? (
          <div className="prose prose-sm dark:prose-invert max-w-none sm:prose-base">
            <RichText data={event.description} enableGutter={false} />
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
          <div
            className={cn(
              'flex flex-col gap-4',
              hasMap && 'md:flex-row md:items-stretch md:gap-6',
            )}
          >
            <div
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-4',
                hasMap && 'md:justify-between',
              )}
            >
              <div className="space-y-3">
                {schedule.hasExplicitTime ? (
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('events.detail.start')}</dt>
                      <dd className="font-medium text-foreground">
                        {schedule.startDate}
                        {schedule.startTime ? ` · ${schedule.startTime}` : null}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('events.detail.end')}</dt>
                      <dd className="font-medium text-foreground">
                        {schedule.endDate}
                        {schedule.endTime ? ` · ${schedule.endTime}` : null}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm font-medium text-foreground">{schedule.range}</p>
                )}
                {event.address ? (
                  <p className="text-sm leading-relaxed">
                    <span className="text-muted-foreground">{t('events.detail.place')} </span>
                    {event.address}
                  </p>
                ) : null}
              </div>

              <a
                className={cn(
                  buttonVariants({ size: 'default', variant: 'outline' }),
                  'inline-flex min-h-11 w-full shrink-0 justify-center sm:w-auto',
                )}
                href={`/eventi/${event.slug}/event.ics`}
                download
              >
                {t('events.detail.addToCalendar')}
              </a>
            </div>

            {hasMap ? (
              <div className="flex w-full shrink-0 flex-col md:w-[min(42%,17.5rem)] lg:w-[50%]">
                <EventLocationMap
                  address={event.address}
                  className="min-h-36 flex-1 md:min-h-0"
                  compact
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                />
              </div>
            ) : null}
          </div>
        </div>

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

        <EventGalleryStrip items={event.gallery} />
      </div>
    </div>
  )
}
