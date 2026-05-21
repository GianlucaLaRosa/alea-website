export const LOCALE_COOKIE = 'payload-locale'

export const DEFAULT_LOCALE = 'it' as const

export type LocaleCode = 'it' | 'en' | 'sl'

export type LocaleDefinition = {
  code: LocaleCode
  label: string
}

/** All locales supported by Payload schema (add new codes here + run migrate). */
export const ALL_LOCALES: LocaleDefinition[] = [
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
  { code: 'sl', label: 'Slovenščina' },
]

export const ALL_LOCALE_CODES = ALL_LOCALES.map((l) => l.code)

export function isLocaleCode(value: string | null | undefined): value is LocaleCode {
  return ALL_LOCALE_CODES.includes(value as LocaleCode)
}

export function getLocaleDefinition(code: LocaleCode): LocaleDefinition {
  return ALL_LOCALES.find((l) => l.code === code) ?? ALL_LOCALES[0]
}

const INTL_LOCALE_MAP: Record<LocaleCode, string> = {
  it: 'it-IT',
  en: 'en-GB',
  sl: 'sl-SI',
}

export function getIntlLocale(code: LocaleCode): string {
  return INTL_LOCALE_MAP[code] ?? INTL_LOCALE_MAP.it
}
