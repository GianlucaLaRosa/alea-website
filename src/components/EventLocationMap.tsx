import { cn } from '@/utilities/ui'

type Props = {
  address?: string
  latitude?: number | null
  longitude?: number | null
  title: string
  compact?: boolean
  className?: string
}

/** Half-width of the OSM bbox in degrees. Smaller = more zoom (e.g. 0.002); larger = wider view. */
const MAP_BBOX_DELTA = 0.002

function buildMapEmbedSrc({ address, latitude, longitude }: Props): string | null {
  if (latitude != null && longitude != null) {
    const delta = MAP_BBOX_DELTA
    const left = longitude - delta
    const right = longitude + delta
    const top = latitude + delta
    const bottom = latitude - delta
    const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`
    const marker = `${latitude}%2C${longitude}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`
  }

  if (address?.trim()) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address.trim())}&output=embed`
  }

  return null
}

export function EventLocationMap({ className, compact = false, ...props }: Props) {
  const src = buildMapEmbedSrc(props)
  if (!src) return null

  return (
    <div
      className={cn(
        compact
          ? 'overflow-hidden rounded-lg border border-border/80'
          : 'overflow-hidden rounded-xl border border-border',
        className,
      )}
    >
      <iframe
        className={
          compact
            ? 'h-full min-h-36 w-full border-0 sm:min-h-40'
            : 'aspect-[16/10] w-full border-0'
        }
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        title={`Mappa: ${props.title}`}
      />
    </div>
  )
}
