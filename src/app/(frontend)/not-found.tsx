import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { t } from '@/i18n/messages'
import { getRequestLocale } from '@/utilities/getRequestLocale'

export default async function NotFound() {
  const locale = await getRequestLocale()

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t(locale, 'notFound.message')}</p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />} variant="default">
        {t(locale, 'notFound.home')}
      </Button>
    </div>
  )
}
