import type { File } from 'payload'

/** Scarica un file remoto per upload Payload (`media`, ecc.). */
export async function fetchFileByURL(url: string, nameHint?: string): Promise<File> {
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) {
    throw new Error(`Download fallito (${res.status}): ${url}`)
  }

  const data = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type')?.split(';')[0]?.trim() ?? 'image/jpeg'
  const ext =
    contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
  const name = nameHint?.trim() || `download-${Date.now()}.${ext}`

  return {
    name: name.endsWith(`.${ext}`) ? name : `${name}.${ext}`,
    data,
    mimetype: contentType,
    size: data.byteLength,
  }
}
