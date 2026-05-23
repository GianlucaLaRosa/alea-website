/** Percorso pubblico elenco e schede giochi. */
export const GAMES_LIST_PATH = '/gdt' as const

export function gameDetailPath(slug: string): string {
  return `${GAMES_LIST_PATH}/${encodeURIComponent(slug)}`
}
