/** Due intervalli [a,b] e [c,d] si sovrappongono se condividono almeno un valore. */
export function rangesOverlap(
  itemMin: number,
  itemMax: number,
  filterMin: number | null,
  filterMax: number | null,
): boolean {
  const low = itemMin > 0 ? itemMin : itemMax
  const high = itemMax > 0 ? itemMax : itemMin
  if (low <= 0 && high <= 0) return filterMin === null && filterMax === null

  if (filterMin !== null && high < filterMin) return false
  if (filterMax !== null && low > filterMax) return false
  return true
}

export function gameOverlapsDurationBuckets(
  minPlayTime: number,
  maxPlayTime: number,
  buckets: { min: number; max: number | null }[],
): boolean {
  if (buckets.length === 0) return true
  return buckets.some((bucket) =>
    rangesOverlap(minPlayTime, maxPlayTime, bucket.min, bucket.max),
  )
}

export function gameMatchesPlayerFilters(
  minPlayers: number,
  maxPlayers: number,
  selected: string[],
): boolean {
  if (selected.length === 0) return true

  const low = minPlayers > 0 ? minPlayers : maxPlayers
  const high = maxPlayers > 0 ? maxPlayers : minPlayers
  if (low <= 0 && high <= 0) return false

  return selected.some((key) => {
    if (key === '10+') return high >= 10
    const n = Number.parseInt(key, 10)
    if (!Number.isFinite(n)) return false
    return n >= low && n <= high
  })
}

export function collectNumericBounds(
  games: { minPlayers: number; maxPlayers: number; minPlayTime: number; maxPlayTime: number }[],
): {
  players: { min: number; max: number }
  duration: { min: number; max: number }
} {
  let playersMin = Infinity
  let playersMax = 0
  let durationMin = Infinity
  let durationMax = 0

  for (const game of games) {
    const pMin = game.minPlayers > 0 ? game.minPlayers : game.maxPlayers
    const pMax = game.maxPlayers > 0 ? game.maxPlayers : game.minPlayers
    if (pMin > 0) playersMin = Math.min(playersMin, pMin)
    if (pMax > 0) playersMax = Math.max(playersMax, pMax)

    const dMin = game.minPlayTime > 0 ? game.minPlayTime : game.maxPlayTime
    const dMax = game.maxPlayTime > 0 ? game.maxPlayTime : game.minPlayTime
    if (dMin > 0) durationMin = Math.min(durationMin, dMin)
    if (dMax > 0) durationMax = Math.max(durationMax, dMax)
  }

  return {
    players: {
      min: Number.isFinite(playersMin) ? playersMin : 1,
      max: playersMax || 1,
    },
    duration: {
      min: Number.isFinite(durationMin) ? durationMin : 0,
      max: durationMax || 0,
    },
  }
}
