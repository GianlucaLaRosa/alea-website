'use client'

import { Button } from '@payloadcms/ui'
import React, { useEffect, useId, useRef, useState } from 'react'

export type AdminFilterMultiSelectOption = {
  value: string
  label: string
}

type Props = {
  label: string
  options: AdminFilterMultiSelectOption[]
  placeholder: string
  selected: string[]
  selectedSummary: string
  onChange: (values: string[]) => void
}

export function AdminFilterMultiSelect({
  label,
  options,
  placeholder,
  selected,
  selectedSummary,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  return (
    <div ref={rootRef} style={{ minWidth: '10rem', position: 'relative' }}>
      <Button
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        buttonStyle="secondary"
        onClick={() => setOpen((current) => !current)}
        size="small"
        type="button"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.length > 0 ? selectedSummary : placeholder}
        </span>
      </Button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          style={{
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--border-radius-m)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            left: 0,
            marginTop: '0.35rem',
            maxHeight: '14rem',
            minWidth: '100%',
            overflowY: 'auto',
            padding: '0.35rem 0',
            position: 'absolute',
            top: '100%',
            zIndex: 20,
          }}
        >
          {options.map((option) => {
            const id = `${listId}-${option.value}`
            const checked = selected.includes(option.value)
            return (
              <label
                key={option.value}
                htmlFor={id}
                style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  fontSize: '0.875rem',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                }}
              >
                <input
                  checked={checked}
                  id={id}
                  onChange={() => toggle(option.value)}
                  type="checkbox"
                />
                {option.label}
              </label>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
