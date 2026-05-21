import configPromise from '@payload-config'
import { getPayload, type PayloadRequest } from 'payload'
import { unstable_cache } from 'next/cache'

import {
  ALL_LOCALES,
  DEFAULT_LOCALE,
  type LocaleCode,
  type LocaleDefinition,
  isLocaleCode,
} from '@/config/localization'

export type PublicLocale = LocaleDefinition & { enabled: boolean }

type SiteSettingsLocaleRow = {
  code?: string | null
  label?: string | null
  enabled?: boolean | null
}

function mergeWithDefaults(rows: SiteSettingsLocaleRow[] | null | undefined): PublicLocale[] {
  if (!rows?.length) {
    return ALL_LOCALES.map((l) => ({ ...l, enabled: true }))
  }

  const byCode = new Map<string, SiteSettingsLocaleRow>()
  for (const row of rows) {
    if (row?.code) byCode.set(row.code, row)
  }

  return ALL_LOCALES.map((def) => {
    const row = byCode.get(def.code)
    return {
      code: def.code,
      label: row?.label?.trim() || def.label,
      enabled: row?.enabled !== false,
    }
  })
}

export async function getPublicLocales(req?: PayloadRequest): Promise<PublicLocale[]> {
  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    req,
  })

  return mergeWithDefaults(settings?.publicLocales)
}

export async function getEnabledPublicLocales(req?: PayloadRequest): Promise<PublicLocale[]> {
  const locales = await getPublicLocales(req)
  const enabled = locales.filter((l) => l.enabled)
  return enabled.length > 0 ? enabled : locales
}

export const getCachedEnabledPublicLocales = unstable_cache(
  async () => getEnabledPublicLocales(),
  ['enabled-public-locales'],
  { tags: ['global_site-settings'] },
)

export function resolveRequestLocale(
  cookieValue: string | undefined,
  enabledLocales: PublicLocale[],
): LocaleCode {
  const enabledCodes = enabledLocales.filter((l) => l.enabled).map((l) => l.code)

  if (cookieValue && isLocaleCode(cookieValue) && enabledCodes.includes(cookieValue)) {
    return cookieValue
  }

  if (enabledCodes.includes(DEFAULT_LOCALE)) {
    return DEFAULT_LOCALE
  }

  return enabledCodes[0] ?? DEFAULT_LOCALE
}
