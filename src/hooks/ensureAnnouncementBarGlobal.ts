import type { Payload } from 'payload'

/**
 * Crea il documento singleton se le tabelle esistono ma la riga no (es. dopo migrate senza seed).
 */
export async function ensureAnnouncementBarGlobal(payload: Payload): Promise<void> {
  try {
    const doc = await payload.findGlobal({ slug: 'announcement-bar', depth: 0 })
    if (doc?.id != null) return
  } catch {
    payload.logger.warn(
      '[announcement-bar] Tabelle assenti o DB non migrato. Esegui: pnpm payload migrate',
    )
    return
  }

  await payload.updateGlobal({
    slug: 'announcement-bar',
    data: { enabled: false },
    depth: 0,
    context: { disableRevalidate: true },
  })
}
