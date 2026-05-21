/** Estrae testo semplice da contenuto Lexical (per ICS / meta). */
export function lexicalToPlainText(
  data: { root?: { children?: { text?: string; children?: { text?: string }[] }[] } } | null | undefined,
): string {
  if (!data?.root?.children?.length) return ''

  const parts: string[] = []

  const walk = (nodes: { text?: string; children?: { text?: string; children?: unknown[] }[] }[]) => {
    for (const node of nodes) {
      if (typeof node.text === 'string' && node.text.trim()) {
        parts.push(node.text.trim())
      }
      if (node.children?.length) {
        walk(node.children as { text?: string; children?: { text?: string; children?: unknown[] }[] }[])
      }
    }
  }

  walk(data.root.children)
  return parts.join('\n')
}
