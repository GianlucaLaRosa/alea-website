import type { Header } from '@/payload-types'

import { resolveCMSLinkHref } from '@/components/Link'

type NavItem = NonNullable<Header['navItems']>[number]

function subLinksOf(item: NavItem) {
  return (item.subNavItems ?? []).filter((s) => s?.link?.label)
}

export type FlatNavEntry = {
  key: string
  link: NonNullable<NavItem['link']>
  referenceAnchor?: string | null
}

/**
 * Stessa logica concettuale dell’header: voci senza sottomenu = un link;
 * con sottomenu = link primario (se cliccabile e con href) + ogni sottovoce.
 */
export function flattenHeaderNavForFooter(
  items: Header['navItems'] | null | undefined,
): FlatNavEntry[] {
  if (!items?.length) return []
  const out: FlatNavEntry[] = []

  for (const item of items) {
    const link = item.link
    if (!link?.label) continue

    const subs = subLinksOf(item)

    if (subs.length === 0) {
      out.push({
        key: item.id ?? `nav-${out.length}-${link.label}`,
        link,
        referenceAnchor: item.referenceAnchor,
      })
      continue
    }

    const primaryClickable = item.primaryLinkClickable !== false
    if (primaryClickable) {
      const href = resolveCMSLinkHref({
        type: link.type,
        reference: link.reference,
        referenceAnchor: item.referenceAnchor,
        url: link.url,
      })
      if (href) {
        out.push({
          key: item.id ? `p-${item.id}` : `nav-p-${out.length}-${link.label}`,
          link,
          referenceAnchor: item.referenceAnchor,
        })
      }
    }

    for (const sub of subs) {
      const sl = sub.link
      if (!sl?.label) continue
      out.push({
        key: sub.id ?? `sub-${out.length}-${sl.label}`,
        link: sl,
        referenceAnchor: sub.referenceAnchor,
      })
    }
  }

  return out
}
