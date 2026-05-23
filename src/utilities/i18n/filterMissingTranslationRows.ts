import type { LocaleCode } from '@/config/localization'

import type { MissingTranslationIssue, MissingTranslationRow } from './findMissingTranslations'

export type MissingTranslationFilters = {
  sourceIds: string[]
  locales: LocaleCode[]
  issues: MissingTranslationIssue[]
}

export type MissingTranslationFilterOption = {
  value: string
  label: string
}

export const ISSUE_FILTER_OPTIONS: MissingTranslationFilterOption[] = [
  { value: 'missing', label: 'Mancante' },
  { value: 'same-as-default', label: 'Identico all’italiano' },
]

export function buildSourceFilterOptions(rows: MissingTranslationRow[]): MissingTranslationFilterOption[] {
  const byId = new Map<string, string>()
  for (const row of rows) {
    byId.set(row.sourceId, row.sourceLabel)
  }
  return [...byId.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

export function buildLocaleFilterOptions(rows: MissingTranslationRow[]): MissingTranslationFilterOption[] {
  const byCode = new Map<string, string>()
  for (const row of rows) {
    byCode.set(row.locale, row.localeLabel)
  }
  return [...byCode.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

export function filterMissingTranslationRows(
  rows: MissingTranslationRow[],
  filters: MissingTranslationFilters,
): MissingTranslationRow[] {
  return rows.filter((row) => {
    if (filters.sourceIds.length > 0 && !filters.sourceIds.includes(row.sourceId)) return false
    if (filters.locales.length > 0 && !filters.locales.includes(row.locale)) return false
    if (filters.issues.length > 0 && !filters.issues.includes(row.issue)) return false
    return true
  })
}

/** Stato iniziale / reset: nessun filtro attivo → mostra tutti i risultati. */
export function emptyMissingTranslationFilters(): MissingTranslationFilters {
  return {
    sourceIds: [],
    locales: [],
    issues: [],
  }
}