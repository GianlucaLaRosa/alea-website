'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import type { ActiveAnnouncement } from '@/utilities/getActiveAnnouncement'
import { getAnnouncementBarStyles } from '@/utilities/announcementBarColors'
import {
  isCampaignDismissed,
  setDismissedCampaignId,
} from '@/utilities/announcementBarStorage'

type Props = {
  announcement: ActiveAnnouncement
}

export function AnnouncementBarClient({ announcement }: Props) {
  const [visible, setVisible] = useState(false)
  const barStyles = useMemo(
    () => getAnnouncementBarStyles(announcement.backgroundColor),
    [announcement.backgroundColor],
  )

  useEffect(() => {
    setVisible(!isCampaignDismissed(announcement.campaignId))
  }, [announcement.campaignId])

  const dismiss = useCallback(() => {
    setDismissedCampaignId(announcement.campaignId)
    setVisible(false)
  }, [announcement.campaignId])

  if (!visible) return null

  return (
    <div
      className="relative w-full border-b border-black/10"
      role="region"
      aria-label="Avviso importante"
      style={barStyles}
    >
      <div className="container relative px-11 py-2.5 sm:px-12 sm:py-3">
        <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed sm:text-base">
          {announcement.message}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current sm:right-4"
          aria-label="Chiudi avviso"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  )
}
