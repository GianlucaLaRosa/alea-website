'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import type { LocaleCode } from '@/config/localization'
import type { PublicLocale } from '@/utilities/getPublicLocales'
import { formatMessage, getMessageCatalog, t, type MessageKey } from '@/i18n/messages'

type LocaleContextValue = {
  locale: LocaleCode
  locales: PublicLocale[]
  setLocale: (code: LocaleCode) => Promise<void>
  t: (key: MessageKey) => string
  tf: (key: MessageKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  children,
  locale,
  locales,
}: {
  children: React.ReactNode
  locale: LocaleCode
  locales: PublicLocale[]
}) {
  const router = useRouter()
  const messages = useMemo(() => getMessageCatalog(locale), [locale])

  const setLocale = useCallback(
    async (code: LocaleCode) => {
      await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: code }),
      })
      router.refresh()
    },
    [router],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      locales: locales.filter((l) => l.enabled),
      setLocale,
      t: (key) => messages[key] ?? t(locale, key),
      tf: (key, vars) => formatMessage(locale, key, vars),
    }),
    [locale, locales, messages, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocaleContext must be used within LocaleProvider')
  }
  return ctx
}
