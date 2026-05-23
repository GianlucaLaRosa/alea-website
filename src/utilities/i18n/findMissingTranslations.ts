import type { Payload, Where } from 'payload'

import { DEFAULT_LOCALE, type LocaleCode } from '@/config/localization'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'
import { getEnabledPublicLocales } from '@/utilities/getPublicLocales'

import {
  sourcesForContexts,
  type CollectionTranslationSource,
  type GlobalTranslationSource,
  type LocalizedFieldKind,
  type TranslationSource,
} from './translationRegistry'
import type { TranslationContext } from '@/access/roles'

export type MissingTranslationIssue = 'missing' | 'same-as-default'

export type MissingTranslationRow = {
  sourceId: string
  sourceLabel: string
  context: TranslationContext
  resourceType: 'collection' | 'global'
  resourceSlug: string
  documentId?: string | number
  documentLabel: string
  fieldPath: string
  fieldLabel: string
  locale: LocaleCode
  localeLabel: string
  issue: MissingTranslationIssue
  editUrl: string
}

function asRecord(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>
}

function getNestedValue(record: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, record)
}

function normalizeFieldValue(value: unknown, kind: LocalizedFieldKind): string {
  if (value == null) return ''
  if (kind === 'text') {
    return typeof value === 'string' ? value.trim() : ''
  }
  if (kind === 'richText') {
    return lexicalToPlainText(value as Parameters<typeof lexicalToPlainText>[0]).trim()
  }
  if (kind === 'array') {
    if (!Array.isArray(value) || value.length === 0) return ''
    return JSON.stringify(value)
  }
  return String(value).trim()
}

function isFieldEmpty(value: unknown, kind: LocalizedFieldKind): boolean {
  return normalizeFieldValue(value, kind) === ''
}

function buildCollectionEditUrl(slug: string, id: string | number, locale: LocaleCode): string {
  return `/admin/collections/${slug}/${id}?locale=${locale}`
}

function buildGlobalEditUrl(slug: string, locale: LocaleCode): string {
  return `/admin/globals/${slug}?locale=${locale}`
}

function documentLabelFromRecord(
  record: Record<string, unknown>,
  titleField: string | undefined,
  fallbackId: string | number,
): string {
  const title = titleField ? getNestedValue(record, titleField) : undefined
  if (typeof title === 'string' && title.trim()) return title.trim()
  return `#${fallbackId}`
}

async function loadLocalizedRecord(
  payload: Payload,
  source: CollectionTranslationSource | GlobalTranslationSource,
  id: string | number | undefined,
  locale: LocaleCode,
): Promise<Record<string, unknown>> {
  if (source.type === 'global') {
    const doc = await payload.findGlobal({
      slug: source.slug,
      depth: 0,
      locale,
      fallbackLocale: null,
    })
    return asRecord(doc)
  }

  const doc = await payload.findByID({
    collection: source.slug,
    id: id!,
    depth: 0,
    locale,
    fallbackLocale: null,
    draft: source.useDrafts ? true : undefined,
  })

  return asRecord(doc)
}

function compareFieldsForLocales(
  source: TranslationSource,
  documentId: string | number | undefined,
  documentLabel: string,
  defaultRecord: Record<string, unknown>,
  targetRecord: Record<string, unknown>,
  targetLocale: LocaleCode,
  targetLocaleLabel: string,
): MissingTranslationRow[] {
  const rows: MissingTranslationRow[] = []

  for (const field of source.fields) {
    const defaultValue = getNestedValue(defaultRecord, field.path)
    const targetValue = getNestedValue(targetRecord, field.path)

    if (isFieldEmpty(defaultValue, field.kind)) {
      continue
    }

    const editUrl =
      source.type === 'global'
        ? buildGlobalEditUrl(source.slug, targetLocale)
        : buildCollectionEditUrl(source.slug, documentId!, targetLocale)

    if (isFieldEmpty(targetValue, field.kind)) {
      rows.push({
        sourceId: source.id,
        sourceLabel: source.label,
        context: source.contexts[0],
        resourceType: source.type,
        resourceSlug: source.slug,
        documentId,
        documentLabel,
        fieldPath: field.path,
        fieldLabel: field.label,
        locale: targetLocale,
        localeLabel: targetLocaleLabel,
        issue: 'missing',
        editUrl,
      })
      continue
    }

    const defaultNorm = normalizeFieldValue(defaultValue, field.kind)
    const targetNorm = normalizeFieldValue(targetValue, field.kind)

    if (defaultNorm === targetNorm) {
      rows.push({
        sourceId: source.id,
        sourceLabel: source.label,
        context: source.contexts[0],
        resourceType: source.type,
        resourceSlug: source.slug,
        documentId,
        documentLabel,
        fieldPath: field.path,
        fieldLabel: field.label,
        locale: targetLocale,
        localeLabel: targetLocaleLabel,
        issue: 'same-as-default',
        editUrl,
      })
    }
  }

  return rows
}

async function scanCollectionSource(
  payload: Payload,
  source: CollectionTranslationSource,
  targetLocales: { code: LocaleCode; label: string }[],
): Promise<MissingTranslationRow[]> {
  const rows: MissingTranslationRow[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: source.slug,
      depth: 0,
      draft: source.useDrafts ? true : undefined,
      limit: 50,
      locale: DEFAULT_LOCALE,
      fallbackLocale: null,
      overrideAccess: true,
      page,
      pagination: true,
      where: source.where as Where | undefined,
    })

    for (const doc of result.docs) {
      const id = doc.id
      const defaultRecord = asRecord(doc)
      const documentLabel = documentLabelFromRecord(defaultRecord, source.titleField, id)

      for (const { code, label } of targetLocales) {
        const targetRecord = await loadLocalizedRecord(payload, source, id, code)
        rows.push(
          ...compareFieldsForLocales(
            source,
            id,
            documentLabel,
            defaultRecord,
            targetRecord,
            code,
            label,
          ),
        )
      }
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  return rows
}

async function scanGlobalSource(
  payload: Payload,
  source: GlobalTranslationSource,
  targetLocales: { code: LocaleCode; label: string }[],
): Promise<MissingTranslationRow[]> {
  const defaultRecord = await loadLocalizedRecord(payload, source, undefined, DEFAULT_LOCALE)
  const documentLabel = documentLabelFromRecord(defaultRecord, source.titleField, source.slug)
  const rows: MissingTranslationRow[] = []

  for (const { code, label } of targetLocales) {
    const targetRecord = await loadLocalizedRecord(payload, source, undefined, code)
    rows.push(
      ...compareFieldsForLocales(
        source,
        undefined,
        documentLabel,
        defaultRecord,
        targetRecord,
        code,
        label,
      ),
    )
  }

  return rows
}

export type FindMissingTranslationsOptions = {
  contexts: TranslationContext[]
  includeSameAsDefault?: boolean
}

export async function findMissingTranslations(
  payload: Payload,
  options: FindMissingTranslationsOptions,
): Promise<MissingTranslationRow[]> {
  const enabled = await getEnabledPublicLocales()
  const targetLocales = enabled
    .filter((locale) => locale.enabled && locale.code !== DEFAULT_LOCALE)
    .map((locale) => ({ code: locale.code as LocaleCode, label: locale.label }))

  if (targetLocales.length === 0) return []

  const sources = sourcesForContexts(options.contexts)
  const includeSameAsDefault = options.includeSameAsDefault ?? true
  const rows: MissingTranslationRow[] = []

  for (const source of sources) {
    const sourceRows =
      source.type === 'collection'
        ? await scanCollectionSource(payload, source, targetLocales)
        : await scanGlobalSource(payload, source, targetLocales)

    rows.push(
      ...sourceRows.filter((row) => includeSameAsDefault || row.issue === 'missing'),
    )
  }

  return rows.sort((a, b) => {
    const bySource = a.sourceLabel.localeCompare(b.sourceLabel, 'it')
    if (bySource !== 0) return bySource
    const byDoc = a.documentLabel.localeCompare(b.documentLabel, 'it')
    if (byDoc !== 0) return byDoc
    return a.locale.localeCompare(b.locale)
  })
}

export async function countMissingTranslations(
  payload: Payload,
  contexts: TranslationContext[],
): Promise<number> {
  const rows = await findMissingTranslations(payload, {
    contexts,
    includeSameAsDefault: false,
  })
  return rows.length
}
