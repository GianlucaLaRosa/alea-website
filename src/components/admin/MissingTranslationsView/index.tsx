import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { hasCmsAccess, translationContextsForUser } from '@/access/roles'
import { findMissingTranslations } from '@/utilities/i18n/findMissingTranslations'

import { MissingTranslationsPanel } from './MissingTranslationsPanel'

const baseClass = 'missing-translations-view'

const MissingTranslationsView: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { permissions, req, visibleEntities } = initPageResult
  const { payload, user } = req

  const content = (() => {
    if (!user || !hasCmsAccess(user)) {
      return <p>Accesso non autorizzato.</p>
    }

    const contexts = translationContextsForUser(user)

    return (
      <MissingTranslationsContent contexts={contexts} payload={payload} />
    )
  })()

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter className={baseClass}>{content}</Gutter>
    </DefaultTemplate>
  )
}

async function MissingTranslationsContent({
  contexts,
  payload,
}: {
  contexts: ReturnType<typeof translationContextsForUser>
  payload: AdminViewServerProps['initPageResult']['req']['payload']
}) {
  const rows = await findMissingTranslations(payload, { contexts })

  return (
    <>
      <header style={{ marginBottom: 'calc(var(--base) * 1.5)' }}>
        <h1 style={{ margin: 0 }}>Traduzioni mancanti</h1>
        <p style={{ color: 'var(--theme-elevation-500)', marginBottom: 0, marginTop: '0.5rem' }}>
          Lingue attive sul sito, rispetto all’italiano (locale predefinito). «Identico
          all’italiano» segnala testi copiati non tradotti.
        </p>
      </header>

      {rows.length === 0 ? (
        <p style={{ color: 'var(--theme-success-500)' }}>
          Nessuna traduzione mancante nel tuo ambito.
        </p>
      ) : (
        <MissingTranslationsPanel rows={rows} />
      )}
    </>
  )
}

export default MissingTranslationsView
