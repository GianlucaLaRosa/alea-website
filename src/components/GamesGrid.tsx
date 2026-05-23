'use client'

import Image from 'next/image'
import Link from 'next/link'

import { TagBadge } from '@/components/TagBadge'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocaleContext } from '@/providers/Locale'
import type { MessageKey } from '@/i18n/messages'
import { formatPlayerRange, formatPlayTimeRange } from '@/utilities/formatGameStats'
import { gameDetailPath } from '@/utilities/gamesRoutes'
import { cn } from '@/utilities/ui'
import type { SerializedGameForClient } from '@/utilities/serializeGameForClient'

type Props = {
  games: SerializedGameForClient[]
  emptyMessageKey?: MessageKey
  onTagClick?: (tagTitle: string) => void
}

export function GamesGrid({
  games,
  emptyMessageKey = 'games.empty.filters',
  onTagClick,
}: Props) {
  const { locale, t } = useLocaleContext()

  if (games.length === 0) {
    return (
      <p className="text-center text-muted-foreground">{t(emptyMessageKey)}</p>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => {
        const players = formatPlayerRange(game, locale)
        const duration = formatPlayTimeRange(game, locale, t('games.minutesAbbr'))
        const href = gameDetailPath(game.slug)

        return (
          <li key={game.id}>
            <Card className="flex h-full flex-col overflow-hidden pt-0">
              <Link className="relative aspect-square w-full bg-muted" href={href}>
                <Image
                  alt={game.title}
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={game.cardImageSrc}
                />
              </Link>
              <CardHeader className="gap-2">
                <CardTitle className="font-heading text-lg leading-snug">
                  <Link className="hover:underline" href={href}>
                    {game.title}
                  </Link>
                </CardTitle>
                {game.shortDescription ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {game.shortDescription}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {players ? (
                    <Badge variant="outline">
                      <span className="text-muted-foreground">{t('games.players')}</span>
                      <span className="font-medium text-foreground">{players}</span>
                    </Badge>
                  ) : null}
                  {duration ? (
                    <Badge variant="outline">
                      <span className="text-muted-foreground">{t('games.duration')}</span>
                      <span className="font-medium text-foreground">{duration}</span>
                    </Badge>
                  ) : null}
                </div>
                {game.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.map((tag) => (
                      <li key={tag.id}>
                        <TagBadge
                          color={tag.color}
                          onClick={
                            onTagClick ? () => onTagClick(tag.title) : undefined
                          }
                        >
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
                  href={href}
                >
                  {t('games.card.details')}
                </Link>
              </CardFooter>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
