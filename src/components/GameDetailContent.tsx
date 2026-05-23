'use client'

import Image from 'next/image'

import { TagBadge } from '@/components/TagBadge'
import { Badge } from '@/components/ui/badge'
import { useLocaleContext } from '@/providers/Locale'
import { formatPlayerRange, formatPlayTimeRange } from '@/utilities/formatGameStats'
import type { SerializedGameForClient } from '@/utilities/serializeGameForClient'

type Props = {
  game: SerializedGameForClient
}

export function GameDetailContent({ game }: Props) {
  const { locale, t } = useLocaleContext()
  const players = formatPlayerRange(game, locale)
  const duration = formatPlayTimeRange(game, locale, t('games.minutesAbbr'))

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        <div className="relative mx-auto aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-lg bg-muted md:mx-0 md:w-44 lg:w-52">
          <Image
            alt={game.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 208px"
            src={game.detailImageSrc}
          />
        </div>

        <header className="min-w-0 flex-1">
          <h1 className="font-heading text-3xl tracking-tight md:text-4xl">{game.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
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
            <ul className="mt-4 flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <li key={tag.id}>
                  <TagBadge color={tag.color}>{tag.title}</TagBadge>
                </li>
              ))}
            </ul>
          ) : null}
        </header>
      </div>

      {game.description || game.heroImageSrc ? (
        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          {game.heroImageSrc ? (
            <figure className="not-prose my-0 mb-4 w-full md:float-right md:mb-3 md:ml-6 md:max-w-[min(100%,280px)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  src={game.heroImageSrc}
                />
              </div>
            </figure>
          ) : null}
          {game.description ? (
            <div className="whitespace-pre-wrap">{game.description}</div>
          ) : null}
          {game.heroImageSrc ? <div className="clear-both" /> : null}
        </div>
      ) : null}

      {game.ownedExpansions.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-xl">{t('games.expansions.owned')}</h2>
          <ul className="mt-3 list-inside list-disc text-muted-foreground">
            {game.ownedExpansions.map((exp) => (
              <li key={`${exp.name}-${exp.bggId ?? 'local'}`}>{exp.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
