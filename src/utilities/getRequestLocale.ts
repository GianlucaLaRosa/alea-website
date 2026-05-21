import { cookies } from 'next/headers'

import { LOCALE_COOKIE } from '@/config/localization'
import type { LocaleCode } from '@/config/localization'
import { getCachedEnabledPublicLocales, resolveRequestLocale } from '@/utilities/getPublicLocales'

export async function getRequestLocale(): Promise<LocaleCode> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const enabledLocales = await getCachedEnabledPublicLocales()

  return resolveRequestLocale(cookieLocale, enabledLocales)
}
