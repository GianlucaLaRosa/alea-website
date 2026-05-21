'use client'

import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import * as React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useLocaleContext } from '@/providers/Locale'
import { getMediaObjectPosition } from '@/utilities/getMediaObjectPosition'
import { cn } from '@/utilities/ui'
import type { SerializedMediaForClient } from '@/utilities/serializeMediaForClient'

type Props = {
  items: SerializedMediaForClient[]
  className?: string
}

export function EventGalleryStrip({ items, className }: Props) {
  const { t, tf } = useLocaleContext()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const active = activeIndex != null ? items[activeIndex] : null
  const canGoPrev = activeIndex != null && activeIndex > 0
  const canGoNext = activeIndex != null && activeIndex < items.length - 1

  const close = React.useCallback(() => setActiveIndex(null), [])

  const goPrev = React.useCallback(() => {
    setActiveIndex((i) => (i != null && i > 0 ? i - 1 : i))
  }, [])

  const goNext = React.useCallback(() => {
    setActiveIndex((i) => (i != null && i < items.length - 1 ? i + 1 : i))
  }, [items.length])

  React.useEffect(() => {
    if (activeIndex == null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [activeIndex, close, goPrev, goNext])

  if (items.length === 0) return null

  return (
    <>
      <div className={cn('border-t border-border pt-6', className)}>
        <h3 className="mb-3 font-heading text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {t('events.gallery.title')}
        </h3>
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory [scrollbar-width:thin]">
          {items.map((item, index) => (
            <li key={item.id} className="shrink-0 snap-start">
              <button
                className="relative size-20 overflow-hidden rounded-lg border border-border ring-offset-background transition hover:ring-2 hover:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-24"
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  alt={item.alt}
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={item.src}
                  style={{
                    objectPosition: getMediaObjectPosition(item.focalX, item.focalY),
                  }}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && activeIndex != null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 pt-14 pb-6 sm:p-6 sm:pt-16"
          role="dialog"
          aria-modal="true"
          aria-label={t('events.gallery.preview')}
          onClick={close}
        >
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-3 sm:left-auto sm:pl-0">
            <p className="text-sm text-white/80 tabular-nums">
              {tf('events.gallery.position', {
                current: String(activeIndex + 1),
                total: String(items.length),
              })}
            </p>
            <Button
              className="shrink-0 bg-background/90 text-foreground hover:bg-background"
              size="sm"
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                close()
              }}
            >
              {t('common.close')}
            </Button>
          </div>

          {items.length > 1 ? (
            <>
              <Button
                aria-label={t('events.gallery.previous')}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 touch-manipulation sm:left-4"
                disabled={!canGoPrev}
                size="icon"
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
              </Button>
              <Button
                aria-label={t('events.gallery.next')}
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 touch-manipulation sm:right-4"
                disabled={!canGoNext}
                size="icon"
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </>
          ) : null}

          <div
            className="relative h-[min(75vh,720px)] w-full max-w-4xl px-10 sm:px-14"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Image
              key={active.id}
              alt={active.alt}
              className="object-contain"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              src={active.src}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
