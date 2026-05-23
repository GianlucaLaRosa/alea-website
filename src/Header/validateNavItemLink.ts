type NavItemRow = {
  primaryLinkClickable?: boolean | null
  subNavItems?: { link?: { label?: string | null } | null }[] | null
  link?: {
    type?: 'custom' | 'reference' | null
    reference?: unknown
    url?: string | null
    label?: string | null
  } | null
}

function rowHasSubLinks(row: NavItemRow | undefined): boolean {
  return (row?.subNavItems ?? []).some((s) => Boolean(s?.link?.label?.trim()))
}

/** Top-level nav row: href obbligatorio salvo etichetta solo-menu con sotto-link. */
export function navItemRowNeedsHref(row: NavItemRow | undefined): boolean {
  if (!rowHasSubLinks(row)) return true
  return row?.primaryLinkClickable !== false
}

export function validateHeaderNavItemLink(
  linkValue: unknown,
  { data }: { data?: NavItemRow },
): string | true {
  const link = linkValue as NavItemRow['link']
  const row = data
  const label = link?.label?.trim()
  if (!label) return 'Label is required.'

  if (!navItemRowNeedsHref(row)) return true

  if (link?.type === 'reference') {
    if (!link.reference) return 'Select a document to link to.'
    return true
  }

  if (link?.type === 'custom') {
    if (!link.url?.trim()) return 'Enter a custom URL.'
    return true
  }

  return 'Select a link type.'
}
