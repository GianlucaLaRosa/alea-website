'use client'

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useLocaleContext } from '@/providers/Locale'
import { buildEventiHref } from '@/utilities/eventiSearchParams'
import type { EventiListParams } from '@/utilities/eventiSearchParams'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  page: number
  totalPages: number
  listParams: EventiListParams
}

export function EventsPagination({ className, page, totalPages, listParams }: Props) {
  const { t } = useLocaleContext()

  if (totalPages <= 1) return null

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const hrefForPage = (p: number) => buildEventiHref('/eventi', { ...listParams, page: p })

  return (
    <div className={cn('mt-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-label={t('pagination.prevAria')}
              disabled={!hasPrevPage}
              href={hasPrevPage ? hrefForPage(page - 1) : undefined}
              text={t('pagination.prev')}
            />
          </PaginationItem>

          {hasExtraPrevPages ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : null}

          {hasPrevPage ? (
            <PaginationItem>
              <PaginationLink href={hrefForPage(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          ) : null}

          <PaginationItem>
            <PaginationLink isActive href={hrefForPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage ? (
            <PaginationItem>
              <PaginationLink href={hrefForPage(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          ) : null}

          {hasExtraNextPages ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : null}

          <PaginationItem>
            <PaginationNext
              aria-label={t('pagination.nextAria')}
              disabled={!hasNextPage}
              href={hasNextPage ? hrefForPage(page + 1) : undefined}
              text={t('pagination.next')}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
