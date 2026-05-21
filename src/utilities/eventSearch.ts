/** Token e regex per evidenziazione match in UI (la ricerca avviene lato server su `searchText`). */

export function getSearchTokens(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function buildSearchRegex(tokens: string[]): RegExp | null {
  if (tokens.length === 0) return null
  const pattern = tokens.map(escapeRegExp).join('|')
  return new RegExp(`(${pattern})`, 'gi')
}
