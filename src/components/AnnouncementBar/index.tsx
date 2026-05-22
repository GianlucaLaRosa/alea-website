import React from 'react'

import { getActiveAnnouncement } from '@/utilities/getActiveAnnouncement'
import { getAnnouncementBarGlobal } from '@/utilities/getAnnouncementBarGlobal'
import { AnnouncementBarClient } from './Component.client'

export async function AnnouncementBar() {
  const data = await getAnnouncementBarGlobal()
  const announcement = getActiveAnnouncement(data)

  if (!announcement) return null

  return <AnnouncementBarClient announcement={announcement} />
}
