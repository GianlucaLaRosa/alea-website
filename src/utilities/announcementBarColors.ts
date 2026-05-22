const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/
export const DEFAULT_ANNOUNCEMENT_BAR_COLOR = '#6366f1'

export function normalizeAnnouncementColor(color: string | null | undefined): string {
  if (!color) return DEFAULT_ANNOUNCEMENT_BAR_COLOR
  const trimmed = color.trim().toLowerCase()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return HEX_PATTERN.test(withHash) ? withHash : DEFAULT_ANNOUNCEMENT_BAR_COLOR
}

/** Testo chiaro o scuro in base alla luminosità dello sfondo (WCAG YIQ). */
export function getReadableTextColor(backgroundHex: string): string {
  const hex = normalizeAnnouncementColor(backgroundHex)
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150 ? '#171717' : '#fafafa'
}

export function getAnnouncementBarStyles(backgroundColor: string): {
  backgroundColor: string
  color: string
} {
  const bg = normalizeAnnouncementColor(backgroundColor)
  return {
    backgroundColor: bg,
    color: getReadableTextColor(bg),
  }
}
