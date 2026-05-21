'use client'

import { FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useMemo } from 'react'

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/
const DEFAULT_COLOR = '#6366f1'

function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (withHash.length === 7 && HEX_PATTERN.test(withHash)) {
    return withHash.toLowerCase()
  }
  return trimmed
}

function toPickerValue(value: string | undefined): string {
  const normalized = normalizeHex(value ?? '')
  return HEX_PATTERN.test(normalized) ? normalized : DEFAULT_COLOR
}

export const ColorField: TextFieldClientComponent = ({ field, path: pathFromProps }) => {
  const {
    admin: { description } = {},
    label,
    required,
  } = field

  const { path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })

  const pickerValue = useMemo(() => toPickerValue(value), [value])

  return (
    <div className="field-type color">
      <FieldLabel htmlFor={path} label={label} required={required} />
      <div className="flex flex-wrap items-center gap-3">
        <input
          aria-label={typeof label === 'string' ? `${label} (selettore)` : 'Colore'}
          className="size-10 cursor-pointer rounded-md border border-[var(--theme-elevation-150)] bg-transparent p-0.5"
          id={`${path}-picker`}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          type="color"
          value={pickerValue}
        />
        <input
          aria-invalid={showError ? true : undefined}
          className="min-w-[7.5rem] flex-1 rounded-md border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] px-3 py-2 font-mono text-sm"
          id={path}
          name={path}
          onChange={(e) => setValue(normalizeHex(e.target.value))}
          placeholder={DEFAULT_COLOR}
          spellCheck={false}
          type="text"
          value={value ?? ''}
        />
        <span
          aria-hidden
          className="size-8 shrink-0 rounded-full border border-[var(--theme-elevation-150)]"
          style={{ backgroundColor: pickerValue }}
        />
      </div>
      {typeof description === 'string' ? (
        <p className="field-description text-sm">{description}</p>
      ) : null}
      <FieldError path={path} showError={showError} />
    </div>
  )
}
