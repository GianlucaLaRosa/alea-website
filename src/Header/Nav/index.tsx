'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink, resolveCMSLinkHref } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { ChevronDownIcon, MenuIcon, SearchIcon } from 'lucide-react'

type NavItem = NonNullable<HeaderType['navItems']>[number]

function subLinksOf(item: NavItem) {
  return (item.subNavItems ?? []).filter((s) => s?.link?.label)
}

function SubNavNextLinks({
  subNavItems,
  className,
  onNavigate,
}: {
  subNavItems: NonNullable<NavItem['subNavItems']>
  className?: string
  onNavigate?: () => void
}) {
  return (
    <nav className={cn('flex flex-col gap-0.5 p-1', className)} aria-label="Sottovoci">
      {subNavItems.map((sub, j) => {
        const l = sub.link
        if (!l) return null
        const href = resolveCMSLinkHref({
          type: l.type,
          reference: l.reference,
          referenceAnchor: sub.referenceAnchor,
          url: l.url,
        })
        if (!href) return null
        const newTabProps = l.newTab ? { rel: 'noopener noreferrer' as const, target: '_blank' as const } : {}
        return (
          <Link
            key={j}
            href={href}
            {...newTabProps}
            onClick={onNavigate}
            className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const { link, referenceAnchor, primaryLinkClickable = true } = item
  const sub = subLinksOf(item)
  if (sub.length === 0) {
    return (
      <CMSLink
        {...link}
        referenceAnchor={referenceAnchor}
        appearance="link"
        className="text-lg"
      />
    )
  }

  const triggerClass = cn(
    'inline-flex h-auto items-center gap-1 px-1 py-0 text-lg font-medium text-primary underline-offset-4 hover:underline',
  )

  if (!primaryLinkClickable) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={triggerClass}
          openOnHover
          delay={120}
          closeDelay={80}
        >
          {link?.label}
          <ChevronDownIcon className="size-4 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-48">
          {sub.map((s, j) => {
            const l = s.link
            if (!l) return null
            const href = resolveCMSLinkHref({
              type: l.type,
              reference: l.reference,
              referenceAnchor: s.referenceAnchor,
              url: l.url,
            })
            if (!href) return null
            const newTabProps = l.newTab ? { rel: 'noopener noreferrer' as const, target: '_blank' as const } : {}
            return (
              <DropdownMenuLinkItem
                key={j}
                render={<Link href={href} {...newTabProps} className="no-underline hover:no-underline" />}
              >
                {l.label}
              </DropdownMenuLinkItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <span className="inline-flex items-center gap-0">
      <CMSLink
        {...link}
        referenceAnchor={referenceAnchor}
        appearance="link"
        className="text-lg"
      />
      <Popover modal={false}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 shrink-0 text-primary"
              aria-label={`Sottovoci: ${link?.label ?? ''}`}
            >
              <ChevronDownIcon className="size-4" />
            </Button>
          }
        />
        <PopoverContent align="start" side="bottom" sideOffset={6} className="w-auto min-w-48 p-0">
          <SubNavNextLinks subNavItems={sub} />
        </PopoverContent>
      </Popover>
    </span>
  )
}

function MobilePrimaryWithSubnav({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const { link, referenceAnchor } = item
  const sub = subLinksOf(item)

  return (
    <div>
      <div className="flex min-h-11 items-stretch rounded-md">
        <CMSLink
          {...link}
          referenceAnchor={referenceAnchor}
          appearance="link"
          className="h-auto min-h-11 flex-1 justify-start py-3 text-lg"
          onClick={onNavigate}
        />
        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-expanded={open}
          aria-label={`Mostra sottovoci: ${link?.label ?? ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDownIcon
            className={cn('size-5 transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      </div>
      {open ? (
        <SubNavNextLinks
          subNavItems={sub}
          className="mt-1 border-l-2 border-muted pl-2"
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  )
}

function MobileNavItem({
  item,
  index,
  onNavigate,
}: {
  item: NavItem
  index: number
  onNavigate: () => void
}) {
  const { link, referenceAnchor, primaryLinkClickable = true } = item
  const sub = subLinksOf(item)

  if (sub.length === 0) {
    return (
      <CMSLink
        {...link}
        referenceAnchor={referenceAnchor}
        appearance="link"
        className="h-auto min-h-11 justify-start py-3 text-lg"
        onClick={onNavigate}
      />
    )
  }

  if (primaryLinkClickable) {
    return (
      <MobilePrimaryWithSubnav item={item} onNavigate={onNavigate} />
    )
  }

  return (
    <Accordion className="rounded-none border-0 bg-transparent shadow-none">
      <AccordionItem value={`nav-${index}`} className="border-0">
        <AccordionTrigger className="min-h-11 py-3 text-lg hover:no-underline">
          {link?.label}
        </AccordionTrigger>
        <AccordionContent className="border-0 pt-0">
          <SubNavNextLinks
            subNavItems={sub}
            className="border-l-2 border-muted pl-2"
            onNavigate={onNavigate}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="hidden items-center gap-3 sm:flex" aria-label="Main">
        {navItems.map((item, i) => (
          <DesktopNavItem key={item.id ?? i} item={item} />
        ))}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      </nav>

      <div className="flex items-center gap-1 sm:hidden">
        <Link
          href="/search"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
        >
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <span className="sr-only">Open menu</span>
            <MenuIcon data-icon="inline-start" />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1" aria-label="Main">
              {navItems.map((item, i) => (
                <MobileNavItem
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
