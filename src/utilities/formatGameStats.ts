import type { LocaleCode } from '@/config/localization'
import { getIntlLocale } from '@/config/localization'

type PlayerRange = {
  minPlayers: number
  maxPlayers: number
}

type PlayTimeRange = {
  minPlayTime: number
  maxPlayTime: number
}

export function formatPlayerRange(
  { minPlayers, maxPlayers }: PlayerRange,
  locale: LocaleCode,
): string | null {
  if (!minPlayers && !maxPlayers) return null
  if (minPlayers > 0 && minPlayers === maxPlayers) {
    return String(minPlayers)
  }
  if (minPlayers > 0 && maxPlayers > 0) {
    return `${minPlayers}–${maxPlayers}`
  }
  if (minPlayers > 0) return String(minPlayers)
  if (maxPlayers > 0) return String(maxPlayers)
  return null
}

export function formatPlayTimeRange(
  { minPlayTime, maxPlayTime }: PlayTimeRange,
  locale: LocaleCode,
  minutesLabel: string,
): string | null {
  if (!minPlayTime && !maxPlayTime) return null
  const intl = getIntlLocale(locale)
  const format = (n: number) =>
    new Intl.NumberFormat(intl).format(n) + (minutesLabel ? ` ${minutesLabel}` : '')

  if (minPlayTime > 0 && minPlayTime === maxPlayTime) {
    return format(minPlayTime)
  }
  if (minPlayTime > 0 && maxPlayTime > 0) {
    return `${format(minPlayTime)}–${format(maxPlayTime)}`
  }
  if (minPlayTime > 0) return format(minPlayTime)
  if (maxPlayTime > 0) return format(maxPlayTime)
  return null
}

/** Valore numerico per filtri client (usa il minimo del range). */
export function gamePlayerFilterValue(minPlayers: number, maxPlayers: number): number {
  return minPlayers > 0 ? minPlayers : maxPlayers
}

export function gameDurationFilterValue(minPlayTime: number, maxPlayTime: number): number {
  return minPlayTime > 0 ? minPlayTime : maxPlayTime
}
