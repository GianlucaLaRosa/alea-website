/** Timestamp ms usato in DB e in `alea-announcement-dismissed`. */
export function createAnnouncementDismissKey(): string {
  return String(Date.now())
}

export function isValidAnnouncementDismissKey(value: string | null | undefined): boolean {
  return typeof value === 'string' && /^\d{10,}$/.test(value.trim())
}
