'use client'

import { useMemo, useState } from 'react'

import { FilterMultiSelect } from '@/components/FilterMultiSelect'
import { GamesGrid } from '@/components/GamesGrid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocaleContext } from '@/providers/Locale'
import {
  DURATION_BUCKETS,
  PLAYER_FILTER_VALUES,
  type DurationBucketId,
} from '@/utilities/gameFilterBuckets'
import {
  gameMatchesPlayerFilters,
  gameOverlapsDurationBuckets,
} from '@/utilities/filterGameRanges'
import type { SerializedGameForClient } from '@/utilities/serializeGameForClient'

type Props = {
  games: SerializedGameForClient[]
}

const initialFilters = {
  query: '',
  players: [] as string[],
  durations: [] as DurationBucketId[],
}

export function GamesListing({ games }: Props) {
  const { t, tf } = useLocaleContext()
  const [filters, setFilters] = useState(initialFilters)

  const durationOptions = useMemo(
    () =>
      DURATION_BUCKETS.map((bucket) => ({
        value: bucket.id,
        label:
          bucket.id === '300+'
            ? t('games.filter.duration300plus')
            : tf('games.filter.durationBucket', {
                min: bucket.min,
                max: bucket.max ?? bucket.min,
              }),
      })),
    [t, tf],
  )

  const playerOptions = useMemo(
    () =>
      PLAYER_FILTER_VALUES.map((value) => ({
        value,
        label:
          value === '10+'
            ? t('games.filter.players10plus')
            : tf('games.filter.playersCount', { count: value }),
      })),
    [t, tf],
  )

  const selectedDurationBuckets = useMemo(
    () => DURATION_BUCKETS.filter((b) => filters.durations.includes(b.id)),
    [filters.durations],
  )

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()

    return games.filter((game) => {
      if (q) {
        const inTitle = game.title.toLowerCase().includes(q)
        const inShort = game.shortDescription.toLowerCase().includes(q)
        const inTags = game.tags.some((tag) => tag.title.toLowerCase().includes(q))
        if (!inTitle && !inShort && !inTags) return false
      }

      if (!gameMatchesPlayerFilters(game.minPlayers, game.maxPlayers, filters.players)) {
        return false
      }

      if (
        !gameOverlapsDurationBuckets(
          game.minPlayTime,
          game.maxPlayTime,
          selectedDurationBuckets,
        )
      ) {
        return false
      }

      return true
    })
  }, [games, filters, selectedDurationBuckets])

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.players.length > 0 ||
    filters.durations.length > 0

  const emptyMessageKey =
    games.length === 0
      ? 'games.empty.catalog'
      : hasActiveFilters
        ? 'games.empty.filters'
        : 'games.search.noResults'

  const playersSummary =
    filters.players.length === 1
      ? playerOptions.find((o) => o.value === filters.players[0])?.label ?? ''
      : tf('games.filter.selectedCount', { count: filters.players.length })

  const durationsSummary =
    filters.durations.length === 1
      ? durationOptions.find((o) => o.value === filters.durations[0])?.label ?? ''
      : tf('games.filter.selectedCount', { count: filters.durations.length })

  const handleTagClick = (tagTitle: string) => {
    setFilters((prev) => ({ ...prev, query: tagTitle }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="min-w-0 flex-1 sm:max-w-md">
          <Label className="sr-only" htmlFor="games-search">
            {t('games.search.label')}
          </Label>
          <Input
            id="games-search"
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            placeholder={t('games.search.placeholder')}
            type="search"
            value={filters.query}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterMultiSelect
            label={t('games.filter.players')}
            options={playerOptions}
            placeholder={t('games.filter.players')}
            selected={filters.players}
            selectedSummary={playersSummary}
            onChange={(players) => setFilters((prev) => ({ ...prev, players }))}
          />
          <FilterMultiSelect
            label={t('games.filter.duration')}
            options={durationOptions}
            placeholder={t('games.filter.duration')}
            selected={filters.durations}
            selectedSummary={durationsSummary}
            onChange={(durations) =>
              setFilters((prev) => ({
                ...prev,
                durations: durations as DurationBucketId[],
              }))
            }
          />
          <Button
            disabled={!hasActiveFilters}
            onClick={() => setFilters(initialFilters)}
            type="button"
            variant="outline"
            size="sm"
          >
            {t('games.filter.reset')}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {tf('games.resultsCount', { count: filtered.length, total: games.length })}
      </p>

      <GamesGrid
        emptyMessageKey={emptyMessageKey}
        games={filtered}
        onTagClick={handleTagClick}
      />
    </div>
  )
}
