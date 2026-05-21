import type { Where } from 'payload'

import type { EventsPeriod } from '@/utilities/eventsPeriod'
import { getSearchTokens } from '@/utilities/eventSearch'
import { eventVisibilityWhere } from '@/utilities/eventVisibilityWhere'

type BuildEventsListWhereArgs = {
  now: string
  period: EventsPeriod
  query?: string
}

export function buildEventsSearchWhere(query: string): Where | null {
  const tokens = getSearchTokens(query)
  if (tokens.length === 0) return null

  return {
    and: tokens.map((token) => ({
      searchText: { contains: token },
    })),
  }
}

export function buildEventsListWhere({
  now,
  period,
  query = '',
}: BuildEventsListWhereArgs): Where {
  const andClauses: Where[] = [eventVisibilityWhere]

  if (period === 'upcoming') {
    andClauses.push({
      endAt: { greater_than: now },
    })
  } else if (period === 'past') {
    andClauses.push({
      endAt: { less_than_equal: now },
    })
  }

  const searchWhere = buildEventsSearchWhere(query)
  if (searchWhere) {
    andClauses.push(searchWhere)
  }

  return { and: andClauses }
}
