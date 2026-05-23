const BGG_PATH_PATTERNS = [
  /\/boardgame(?:expansion)?\/(\d+)/i,
  /[?&]id=(\d+)/i,
]

/** Estrae l'objectid BGG da URL pagina gioco o da stringa numerica. */
export function parseBggObjectId(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^\d+$/.test(trimmed)) {
    const id = Number.parseInt(trimmed, 10)
    return Number.isFinite(id) && id > 0 ? id : null
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    for (const pattern of BGG_PATH_PATTERNS) {
      const match = url.pathname.match(pattern) ?? url.search.match(pattern)
      if (match?.[1]) {
        const id = Number.parseInt(match[1], 10)
        if (Number.isFinite(id) && id > 0) return id
      }
    }
  } catch {
    return null
  }

  return null
}
