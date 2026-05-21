import { isEventsPeriod, type EventsPeriod } from '@/utilities/eventsPeriod'

export const EVENTS_PAGE_SIZE = 12

export type EventiListParams = {
  period?: EventsPeriod
  q?: string | null
  page?: number
}

export function parseEventiPage(pageParam: string | undefined): number {
  const n = Number.parseInt(pageParam ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

/** URL lista eventi: `period` omesso = in arrivo; `page` omesso = 1. */
export function buildEventiHref(basePath: string, params: EventiListParams = {}): string {
  const search = new URLSearchParams()
  const period = params.period ?? 'upcoming'

  if (period === 'past' || period === 'all') {
    search.set('period', period)
  }

  const q = params.q?.trim()
  if (q) {
    search.set('q', q)
  }

  const page = params.page ?? 1
  if (page > 1) {
    search.set('page', String(page))
  }

  const qs = search.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function getEventiListParams(searchParams: URLSearchParams): {
  period: EventsPeriod
  q: string
  page: number
} {
  const periodParam = searchParams.get('period')
  const period = isEventsPeriod(periodParam) ? periodParam : 'upcoming'

  return {
    period,
    q: searchParams.get('q')?.trim() ?? '',
    page: parseEventiPage(searchParams.get('page') ?? undefined),
  }
}
