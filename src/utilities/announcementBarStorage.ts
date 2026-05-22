/** Valore = timestamp (ms) dell’ultima chiusura; chiave fissa, un solo record. */
export const ANNOUNCEMENT_BAR_DISMISS_KEY = 'alea-announcement-dismissed'

export function getDismissedAnnouncementKey(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(ANNOUNCEMENT_BAR_DISMISS_KEY)
  } catch {
    return null
  }
}

export function setDismissedAnnouncementKey(dismissKey: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ANNOUNCEMENT_BAR_DISMISS_KEY, dismissKey)
  } catch {
    // storage pieno o disabilitato
  }
}

export function isAnnouncementDismissed(dismissKey: string): boolean {
  return getDismissedAnnouncementKey() === dismissKey
}

/** @deprecated Usa isAnnouncementDismissed */
export const isCampaignDismissed = isAnnouncementDismissed

/** @deprecated Usa setDismissedAnnouncementKey */
export const setDismissedCampaignId = setDismissedAnnouncementKey

/** @deprecated Usa getDismissedAnnouncementKey */
export const getDismissedCampaignId = getDismissedAnnouncementKey
