import type { AnnouncementBar } from '@/payload-types'
import { normalizeAnnouncementColor } from '@/utilities/announcementBarColors'

export type ActiveAnnouncement = {
  campaignId: string
  message: string
  backgroundColor: string
}

function isWithinSchedule(startAt: string, endAt: string, now: Date): boolean {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  const time = now.getTime()
  return time >= start && time <= end
}

export function getActiveAnnouncement(
  data: AnnouncementBar | null | undefined,
  now: Date = new Date(),
): ActiveAnnouncement | null {
  if (!data?.enabled) return null
  if (!data.campaignId?.trim() || !data.message?.trim()) return null
  if (!data.startAt || !data.endAt) return null
  if (!isWithinSchedule(data.startAt, data.endAt, now)) return null

  const { backgroundColor } = data
  if (!backgroundColor?.trim()) return null

  return {
    campaignId: data.campaignId.trim(),
    message: data.message.trim(),
    backgroundColor: normalizeAnnouncementColor(backgroundColor),
  }
}
