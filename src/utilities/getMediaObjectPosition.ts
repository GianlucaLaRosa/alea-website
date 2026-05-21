/** CSS object-position from Payload media focal point (0–100). */
export function getMediaObjectPosition(
  focalX?: number | null,
  focalY?: number | null,
): string {
  const x = focalX ?? 50
  const y = focalY ?? 50
  return `${x}% ${y}%`
}
