import type { LocaleCode } from '@/config/localization'
import { getIntlLocale } from '@/config/localization'
import { formatEventDateRange } from '@/utilities/formatEventDates'

function isMidnight(d: Date) {
  return d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0
}

export type EventScheduleDetails = {
  range: string
  startDate: string
  endDate: string
  startTime: string | null
  endTime: string | null
  hasExplicitTime: boolean
}

export function formatEventSchedule(
  startIso: string,
  endIso: string,
  locale: LocaleCode = 'it',
): EventScheduleDetails {
  const intlLocale = getIntlLocale(locale)
  const start = new Date(startIso)
  const end = new Date(endIso)
  const startNoTime = isMidnight(start)
  const endNoTime = isMidnight(end)
  const timeFmt: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
  const dateFmt: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  return {
    range: formatEventDateRange(startIso, endIso, locale),
    startDate: start.toLocaleDateString(intlLocale, dateFmt),
    endDate: end.toLocaleDateString(intlLocale, dateFmt),
    startTime: startNoTime ? null : start.toLocaleTimeString(intlLocale, timeFmt),
    endTime: endNoTime ? null : end.toLocaleTimeString(intlLocale, timeFmt),
    hasExplicitTime: !startNoTime || !endNoTime,
  }
}
