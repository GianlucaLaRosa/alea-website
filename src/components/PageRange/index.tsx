import React from 'react'

import type { LocaleCode } from '@/config/localization'
import { formatMessage, t, type MessageKey } from '@/i18n/messages'

type CollectionKey = 'posts'

const collectionKeys: Record<CollectionKey, { singular: MessageKey; plural: MessageKey }> = {
  posts: { singular: 'posts.singular', plural: 'posts.plural' },
}

export const PageRange: React.FC<{
  className?: string
  collection?: CollectionKey
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  locale: LocaleCode
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    locale,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const messageKeys = collection ? collectionKeys[collection] : null

  const singular = collectionLabelsFromProps?.singular
    ?? (messageKeys ? t(locale, messageKeys.singular) : '')
  const plural = collectionLabelsFromProps?.plural
    ?? (messageKeys ? t(locale, messageKeys.plural) : '')

  if (typeof totalDocs === 'undefined' || totalDocs === 0) {
    return (
      <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
        {t(locale, 'pageRange.noResults')}
      </div>
    )
  }

  const label = totalDocs > 1 ? plural : singular
  const range =
    indexStart > 0 && indexEnd > indexStart ? ` - ${indexEnd}` : indexEnd > 0 ? ` - ${indexEnd}` : ''

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {formatMessage(locale, 'pageRange.showing', {
        start: indexStart,
        range,
        total: totalDocs,
        label,
      })}
    </div>
  )
}
