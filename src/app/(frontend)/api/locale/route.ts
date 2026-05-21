import { NextResponse } from 'next/server'

import { LOCALE_COOKIE } from '@/config/localization'
import { isLocaleCode } from '@/config/localization'
import { getEnabledPublicLocales } from '@/utilities/getPublicLocales'

export async function POST(request: Request) {
  let locale: string | undefined

  try {
    const body = (await request.json()) as { locale?: string }
    locale = body.locale
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!locale || !isLocaleCode(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const enabled = await getEnabledPublicLocales()
  if (!enabled.some((l) => l.code === locale && l.enabled)) {
    return NextResponse.json({ error: 'Locale not enabled' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true, locale })

  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
  })

  return response
}
