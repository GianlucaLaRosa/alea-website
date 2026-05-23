'use client'

import React, { useMemo, useState } from 'react'

import type { LocaleCode } from '@/config/localization'
import type { MissingTranslationRow } from '@/utilities/i18n/findMissingTranslations'
import {
  buildLocaleFilterOptions,
  buildSourceFilterOptions,
  emptyMissingTranslationFilters,
  filterMissingTranslationRows,
  ISSUE_FILTER_OPTIONS,
  type MissingTranslationFilters,
} from '@/utilities/i18n/filterMissingTranslationRows'

import { AdminFilterMultiSelect } from './AdminFilterMultiSelect'

const issueLabel = {
  missing: 'Mancante',
  'same-as-default': 'Identico all’italiano',
} as const

type Props = {
  rows: MissingTranslationRow[]
}

const filterPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'calc(var(--base) * 1.25)',
  marginBottom: 'calc(var(--base) * 1.5)',
  alignItems: 'flex-end',
}

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  minWidth: '10rem',
}

const filterTitleStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--theme-elevation-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

function buildSelectedSummary(
  selected: string[],
  options: { value: string; label: string }[],
  allLabel: string,
): string {
  if (selected.length === 0) return ''
  if (selected.length === options.length) return allLabel

  const labels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label)

  if (labels.length <= 2) return labels.join(', ')
  return `${labels.length} selezionati`
}

export const MissingTranslationsPanel: React.FC<Props> = ({ rows }) => {
  const sourceOptions = useMemo(() => buildSourceFilterOptions(rows), [rows])
  const localeOptions = useMemo(() => buildLocaleFilterOptions(rows), [rows])

  const [filters, setFilters] = useState<MissingTranslationFilters>(emptyMissingTranslationFilters)

  const filteredRows = useMemo(() => filterMissingTranslationRows(rows, filters), [rows, filters])

  const updateFilters = (patch: Partial<MissingTranslationFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
  }

  const resetFilters = () => {
    setFilters(emptyMissingTranslationFilters())
  }

  const hasActiveFilters =
    filters.sourceIds.length > 0 ||
    filters.locales.length > 0 ||
    filters.issues.length > 0

  const sourceSummary = buildSelectedSummary(filters.sourceIds, sourceOptions, 'Tutti gli ambiti')
  const localeSummary = buildSelectedSummary(filters.locales, localeOptions, 'Tutte le lingue')
  const issueSummary = buildSelectedSummary(filters.issues, ISSUE_FILTER_OPTIONS, 'Tutti gli stati')

  return (
    <>
      <div style={filterPanelStyle}>
        <div style={filterGroupStyle}>
          <span style={filterTitleStyle}>Ambito</span>
          <AdminFilterMultiSelect
            label="Ambito"
            options={sourceOptions}
            placeholder="Tutti gli ambiti"
            selected={filters.sourceIds}
            selectedSummary={sourceSummary}
            onChange={(sourceIds) => updateFilters({ sourceIds })}
          />
        </div>

        <div style={filterGroupStyle}>
          <span style={filterTitleStyle}>Lingua</span>
          <AdminFilterMultiSelect
            label="Lingua"
            options={localeOptions}
            placeholder="Tutte le lingue"
            selected={filters.locales}
            selectedSummary={localeSummary}
            onChange={(locales) =>
              updateFilters({ locales: locales as LocaleCode[] })
            }
          />
        </div>

        <div style={filterGroupStyle}>
          <span style={filterTitleStyle}>Stato</span>
          <AdminFilterMultiSelect
            label="Stato"
            options={ISSUE_FILTER_OPTIONS}
            placeholder="Tutti gli stati"
            selected={filters.issues}
            selectedSummary={issueSummary}
            onChange={(issues) =>
              updateFilters({ issues: issues as MissingTranslationFilters['issues'] })
            }
          />
        </div>

        <div style={{ ...filterGroupStyle, alignSelf: 'flex-end' }}>
          <button
            disabled={!hasActiveFilters}
            onClick={resetFilters}
            style={{
              background: 'var(--theme-elevation-100)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 'var(--border-radius-m)',
              cursor: !hasActiveFilters ? 'default' : 'pointer',
              fontSize: '0.875rem',
              opacity: !hasActiveFilters ? 0.5 : 1,
              padding: '0.45rem 0.75rem',
            }}
            type="button"
          >
            Reimposta filtri
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--theme-elevation-500)', fontSize: '0.875rem', marginTop: 0 }}>
        {filteredRows.length} di {rows.length} risultati
      </p>

      {filteredRows.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>
          Nessun risultato con i filtri selezionati.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              fontSize: '0.925rem',
              width: '100%',
            }}
          >
            <thead>
              <tr>
                {['Ambito', 'Documento', 'Campo', 'Lingua', 'Stato', ''].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      borderBottom: '1px solid var(--theme-elevation-150)',
                      padding: '0.65rem 0.75rem',
                      textAlign: 'left',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={`${row.sourceId}-${String(row.documentId ?? row.resourceSlug)}-${row.fieldPath}-${row.locale}-${row.issue}`}
                >
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    {row.sourceLabel}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    {row.documentLabel}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    {row.fieldLabel}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    {row.localeLabel}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    <span
                      style={{
                        color:
                          row.issue === 'missing'
                            ? 'var(--theme-error-500)'
                            : 'var(--theme-warning-500)',
                      }}
                    >
                      {issueLabel[row.issue]}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', verticalAlign: 'top' }}>
                    <a href={row.editUrl}>Apri</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default MissingTranslationsPanel
