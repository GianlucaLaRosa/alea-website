'use client'

import type { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const DocumentRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Footer['documents']>[number]>()

  const label = data?.label
  const n = rowNumber !== undefined ? rowNumber + 1 : ''

  return <div>{label ? `Documento ${n}: ${label}`.trim() : 'Documento'}</div>
}
