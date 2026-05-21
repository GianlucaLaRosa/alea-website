import type { LocaleCode } from '@/config/localization'
import { getIntlLocale } from '@/config/localization'

function isMidnight(d: Date) {
  return d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0
}

export function formatEventDateRange(
  startIso: string,
  endIso: string,
  locale: LocaleCode = 'it',
): string {
  const intlLocale = getIntlLocale(locale)
  const start = new Date(startIso)
  const end = new Date(endIso)
  const startNoTime = isMidnight(start)
  const endNoTime = isMidnight(end)

  const dateFmt: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const withTime: Intl.DateTimeFormatOptions = {
    ...dateFmt,
    hour: '2-digit',
    minute: '2-digit',
  }

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  if (sameDay) {
    const dayStr = start.toLocaleDateString(intlLocale, dateFmt)
    if (startNoTime && endNoTime) return dayStr
    const t0 = start.toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit' })
    const t1 = end.toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit' })
    return `${dayStr}, ${t0} – ${t1}`
  }

  const a = start.toLocaleString(intlLocale, startNoTime ? dateFmt : withTime)
  const b = end.toLocaleString(intlLocale, endNoTime ? dateFmt : withTime)
  return `${a} – ${b}`
}
