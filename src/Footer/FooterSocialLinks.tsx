import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { footerSocialIconMap, footerSocialPlatformOptions, type FooterSocialPlatform } from './socialPlatforms'

type SocialRow = NonNullable<Footer['socialLinks']>[number]

function normalizeUrl(url: string) {
  const t = url.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

function platformAriaLabel(platform: FooterSocialPlatform | null | undefined) {
  const name =
    footerSocialPlatformOptions.find((o) => o.value === (platform ?? 'other'))?.label ?? 'Social'
  return `Apri ${name} (si apre in una nuova scheda)`
}

export function FooterSocialLinks({ items }: { items: SocialRow[] | null | undefined }) {
  if (!items?.length) return null

  return (
    <ul className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
      {items.map((item, i) => {
        const href = normalizeUrl(item.url ?? '')
        if (!href) return null

        const platform = (item.platform ?? 'other') as FooterSocialPlatform
        const Icon = footerSocialIconMap[platform] ?? footerSocialIconMap.other

        return (
          <li key={item.id ?? i}>
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2 text-white/90 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0 sm:min-w-0 sm:p-2.5"
              aria-label={platformAriaLabel(platform)}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
