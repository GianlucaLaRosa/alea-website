const TAG_COLOR_PALETTE = [
  '#6366f1',
  '#0d9488',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#dc2626',
  '#0891b2',
]

/** Colore esadecimale casuale per nuovi tag (palette fissa). */
export function randomTagColor(): string {
  const index = Math.floor(Math.random() * TAG_COLOR_PALETTE.length)
  return TAG_COLOR_PALETTE[index] ?? TAG_COLOR_PALETTE[0]
}
