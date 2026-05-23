import type { TranslationContext } from '@/access/roles'

export type LocalizedFieldKind = 'text' | 'richText' | 'array'

export type LocalizedFieldDef = {
  path: string
  label: string
  kind: LocalizedFieldKind
}

export type CollectionTranslationSource = {
  type: 'collection'
  id: string
  slug: 'games' | 'tags' | 'events' | 'pages' | 'posts'
  label: string
  contexts: TranslationContext[]
  fields: LocalizedFieldDef[]
  where?: Record<string, unknown>
  titleField?: string
  useDrafts?: boolean
}

export type GlobalTranslationSource = {
  type: 'global'
  id: string
  slug: 'announcement-bar' | 'header' | 'footer'
  label: string
  contexts: TranslationContext[]
  fields: LocalizedFieldDef[]
  titleField?: string
}

export type TranslationSource = CollectionTranslationSource | GlobalTranslationSource

export const TRANSLATION_SOURCES: TranslationSource[] = [
  {
    type: 'collection',
    id: 'games',
    slug: 'games',
    label: 'Giochi',
    contexts: ['games'],
    titleField: 'title',
    fields: [
      { path: 'title', label: 'Titolo', kind: 'text' },
      { path: 'shortDescription', label: 'Descrizione breve', kind: 'text' },
      { path: 'description', label: 'Descrizione', kind: 'text' },
    ],
  },
  {
    type: 'collection',
    id: 'tags-games',
    slug: 'tags',
    label: 'Tag giochi',
    contexts: ['games'],
    where: { scope: { equals: 'games' } },
    titleField: 'title',
    fields: [{ path: 'title', label: 'Nome', kind: 'text' }],
  },
  {
    type: 'collection',
    id: 'tags-events',
    slug: 'tags',
    label: 'Tag eventi',
    contexts: ['events'],
    where: { scope: { equals: 'events' } },
    titleField: 'title',
    fields: [{ path: 'title', label: 'Nome', kind: 'text' }],
  },
  {
    type: 'collection',
    id: 'events',
    slug: 'events',
    label: 'Eventi',
    contexts: ['events'],
    titleField: 'title',
    useDrafts: true,
    fields: [
      { path: 'title', label: 'Titolo', kind: 'text' },
      { path: 'address', label: 'Indirizzo', kind: 'text' },
      { path: 'description', label: 'Descrizione', kind: 'richText' },
      { path: 'ticketLabel', label: 'Testo pulsante biglietti', kind: 'text' },
      { path: 'links', label: 'Altri link', kind: 'array' },
      { path: 'meta.title', label: 'SEO titolo', kind: 'text' },
      { path: 'meta.description', label: 'SEO descrizione', kind: 'text' },
    ],
  },
  {
    type: 'global',
    id: 'announcement-bar',
    slug: 'announcement-bar',
    label: 'Barra annunci',
    contexts: ['events'],
    titleField: 'message',
    fields: [{ path: 'message', label: 'Testo', kind: 'text' }],
  },
  {
    type: 'global',
    id: 'header',
    slug: 'header',
    label: 'Header',
    contexts: ['system'],
    fields: [{ path: 'navItems', label: 'Navigazione', kind: 'array' }],
  },
  {
    type: 'global',
    id: 'footer',
    slug: 'footer',
    label: 'Footer',
    contexts: ['system'],
    fields: [{ path: 'address', label: 'Indirizzo', kind: 'text' }],
  },
  {
    type: 'collection',
    id: 'pages',
    slug: 'pages',
    label: 'Pagine',
    contexts: ['system'],
    titleField: 'title',
    useDrafts: true,
    fields: [
      { path: 'title', label: 'Titolo', kind: 'text' },
      { path: 'meta.title', label: 'SEO titolo', kind: 'text' },
      { path: 'meta.description', label: 'SEO descrizione', kind: 'text' },
    ],
  },
  {
    type: 'collection',
    id: 'posts',
    slug: 'posts',
    label: 'Post',
    contexts: ['system'],
    titleField: 'title',
    useDrafts: true,
    fields: [
      { path: 'title', label: 'Titolo', kind: 'text' },
      { path: 'meta.title', label: 'SEO titolo', kind: 'text' },
      { path: 'meta.description', label: 'SEO descrizione', kind: 'text' },
    ],
  },
]

export function sourcesForContexts(contexts: TranslationContext[]): TranslationSource[] {
  const set = new Set(contexts)
  return TRANSLATION_SOURCES.filter((source) =>
    source.contexts.some((context) => set.has(context)),
  )
}
