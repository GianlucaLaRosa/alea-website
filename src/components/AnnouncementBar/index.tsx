import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { getActiveAnnouncement } from '@/utilities/getActiveAnnouncement'
import { AnnouncementBarClient } from './Component.client'

export async function AnnouncementBar() {
  const data = await getCachedGlobal('announcement-bar', 0)
  const announcement = getActiveAnnouncement(data)

  if (!announcement) return null

  return <AnnouncementBarClient announcement={announcement} />
}
