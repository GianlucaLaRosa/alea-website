import type { LocaleCode } from '@/config/localization'
import { getRequestLocale } from '@/utilities/getRequestLocale'

export async function getPayloadLocaleOptions(locale?: LocaleCode) {
  const resolved = locale ?? (await getRequestLocale())

  return {
    locale: resolved,
    fallbackLocale: 'it' as const,
  }
}
