import type { AnnouncementBar } from '@/payload-types'
import type { LocaleCode } from '@/config/localization'
import { getCachedGlobal } from '@/utilities/getGlobals'

/** Non fa fallire build/layout se il DB non è migrato o la tabella manca. */
export async function getAnnouncementBarGlobal(
  locale?: LocaleCode,
): Promise<AnnouncementBar | null> {
  try {
    return await getCachedGlobal('announcement-bar', 0, locale)
  } catch {
    return null
  }
}
