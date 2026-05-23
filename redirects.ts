import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const gamesLegacyRedirects = [
    {
      source: '/giochi',
      destination: '/gdt',
      permanent: true,
    },
    {
      source: '/giochi/:slug',
      destination: '/gdt/:slug',
      permanent: true,
    },
  ]

  return [internetExplorerRedirect, ...gamesLegacyRedirects]
}
