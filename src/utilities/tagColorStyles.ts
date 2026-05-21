const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/
const DEFAULT_TAG_COLOR = '#6366f1'

export function normalizeTagColor(color: string | null | undefined): string {
  if (!color) return DEFAULT_TAG_COLOR
  const trimmed = color.trim().toLowerCase()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return HEX_PATTERN.test(withHash) ? withHash : DEFAULT_TAG_COLOR
}

export function getTagColorStyles(color: string | null | undefined): {
  backgroundColor: string
  borderColor: string
  color: string
} {
  const hex = normalizeTagColor(color)
  return {
    backgroundColor: `${hex}22`,
    borderColor: `${hex}55`,
    color: hex,
  }
}
