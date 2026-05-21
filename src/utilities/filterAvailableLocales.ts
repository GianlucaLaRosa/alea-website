import type { Locale, PayloadRequest } from 'payload'

import { ALL_LOCALE_CODES, isLocaleCode } from '@/config/localization'
import { getEnabledPublicLocales } from '@/utilities/getPublicLocales'

export async function filterAvailableLocales({
  locales,
  req,
}: {
  locales: Locale[]
  req: PayloadRequest
}): Promise<Locale[]> {
  try {
    const enabled = await getEnabledPublicLocales(req)
    const enabledCodes = new Set(enabled.map((l) => l.code))

    if (enabledCodes.size === 0) return locales

    return locales.filter((locale) => {
      const code = typeof locale === 'string' ? locale : locale.code
      return isLocaleCode(code) && enabledCodes.has(code)
    })
  } catch {
    return locales.filter((locale) => {
      const code = typeof locale === 'string' ? locale : locale.code
      return isLocaleCode(code) && ALL_LOCALE_CODES.includes(code)
    })
  }
}
