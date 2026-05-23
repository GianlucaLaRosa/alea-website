import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import React from 'react'

import { hasCmsAccess, translationContextsForUser } from '@/access/roles'
import { countMissingTranslations } from '@/utilities/i18n/findMissingTranslations'

const MissingTranslationsNavLink: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || !hasCmsAccess(user)) return null

  const contexts = translationContextsForUser(user)
  if (contexts.length === 0) return null

  const count = await countMissingTranslations(payload, contexts)

  return (
    <a
      className="nav__link"
      href="/admin/missing-translations"
      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
    >
      <span>Traduzioni</span>
      {count > 0 ? (
        <span
          style={{
            background: 'var(--theme-error-500)',
            borderRadius: '999px',
            color: 'var(--theme-elevation-0)',
            fontSize: '0.75rem',
            fontWeight: 600,
            lineHeight: 1,
            minWidth: '1.25rem',
            padding: '0.15rem 0.4rem',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      ) : null}
    </a>
  )
}

export default MissingTranslationsNavLink
