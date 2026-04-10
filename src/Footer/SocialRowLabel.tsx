'use client'

import type { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { footerSocialPlatformOptions } from './socialPlatforms'

export const SocialRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Footer['socialLinks']>[number]>()

  const platformLabel =
    footerSocialPlatformOptions.find((o) => o.value === data?.platform)?.label ?? 'Social'
  const n = rowNumber !== undefined ? rowNumber + 1 : ''

  return <div>{`Social ${n}: ${platformLabel}`.trim()}</div>
}
