import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { SiteLogo } from '@/components/SiteLogo'
import { CMSLink } from '@/components/Link'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

import { FooterSocialLinks } from './FooterSocialLinks'
import { flattenHeaderNavForFooter } from './flattenHeaderNav'

export async function Footer() {
  const [footerData, headerData] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('header', 1)(),
  ])

  const navEntries = flattenHeaderNavForFooter(headerData?.navItems)
  const documents = footerData?.documents || []

  const { address, emailInfo, emailPec, codiceFiscale, socialLinks } = footerData ?? {}

  const year = new Date().getFullYear()

  const hasSocial = Boolean(socialLinks?.length)
  const hasNav = navEntries.length > 0
  const hasSedeContatti =
    Boolean(address) || Boolean(emailInfo) || Boolean(emailPec) || Boolean(codiceFiscale)

  const socialBlock = hasSocial ? (
    <div className="flex min-w-0 flex-col items-center max-sm:w-full sm:items-start">
      <p className="mb-2 w-full text-xs font-medium uppercase tracking-wide text-white/50 max-sm:text-center sm:mb-3 sm:text-left">
        Social
      </p>
      <FooterSocialLinks items={socialLinks} />
    </div>
  ) : null

  const navBlock = hasNav ? (
    <nav
      className="flex min-w-0 flex-col items-center gap-2 max-sm:w-full max-sm:text-center sm:min-w-[12rem] sm:shrink-0 sm:items-start sm:gap-2.5 sm:text-left"
      aria-label="Navigazione"
    >
      <p className="mb-0.5 w-full text-xs font-medium uppercase tracking-wide text-white/50 max-sm:text-center sm:mb-1 sm:text-left">
        Navigazione
      </p>
      {navEntries.map(({ key, link, referenceAnchor }) => (
        <CMSLink
          appearance="link"
          key={key}
          className="w-fit text-sm text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white sm:text-base"
          referenceAnchor={referenceAnchor}
          {...link}
        />
      ))}
    </nav>
  ) : null

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-7 py-7 sm:gap-10 sm:pt-10 sm:pb-7">
        {/* Stesso breakpoint dell&apos;header: &lt; sm stack compatto, ≥ sm riga orizzontale */}
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8 lg:gap-12">
          <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-start">
            <SiteLogo
              header={headerData}
              className="flex items-center"
              imgClassName="max-h-[4.5rem] w-auto max-w-[9rem] sm:max-h-28 sm:max-w-[12rem]"
            />
          </div>

          <div className="max-w-md min-w-0 space-y-2.5 text-sm leading-relaxed text-white/90 max-sm:mx-auto max-sm:max-w-none max-sm:text-center sm:space-y-3 lg:max-w-sm sm:text-left">
            {hasSedeContatti ? (
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">
                Sede e contatti
              </p>
            ) : null}
            {address ? (
              <p className="whitespace-pre-line text-white">{address}</p>
            ) : null}
            {emailInfo ? (
              <p>
                <a
                  className="underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                  href={`mailto:${emailInfo}`}
                >
                  {emailInfo}
                </a>
              </p>
            ) : null}
            {emailPec ? (
              <p>
                <span className="mr-1 text-white/60">PEC</span>
                <a
                  className="underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                  href={`mailto:${emailPec}`}
                >
                  {emailPec}
                </a>
              </p>
            ) : null}
            {codiceFiscale ? (
              <p className="text-white/80">
                <span className="text-white/55">CF</span> {codiceFiscale}
              </p>
            ) : null}
          </div>

          {hasSocial || hasNav ? (
            <div className="flex w-full flex-col items-center gap-8 sm:contents sm:w-auto sm:gap-0">
              {navBlock}
              {socialBlock}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:gap-8 sm:pt-8',
            documents.length > 0 ? 'sm:justify-between' : 'sm:justify-end',
          )}
        >
          {documents.length > 0 ? (
            <nav
              aria-label="Documenti"
              className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2"
            >
              {documents.map((row) => {
                const file = row.file
                if (typeof file !== 'object' || !file?.url) return null
                const href = getMediaUrl(file.url, file.updatedAt)
                return (
                  <a
                    key={row.id}
                    href={href}
                    download={file.filename ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 w-fit py-2 leading-snug text-white/90 underline decoration-white/35 underline-offset-4 sm:min-h-0 sm:py-0 hover:decoration-white"
                  >
                    {row.label}
                  </a>
                )
              })}
            </nav>
          ) : null}
          <p className="w-full text-center text-xs text-white/55 max-sm:pt-1 sm:w-auto sm:shrink-0 sm:text-right sm:text-sm">
            Copyright © {year}
          </p>
        </div>
      </div>
    </footer>
  )
}
