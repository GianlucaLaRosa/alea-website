"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"

function Sheet({ ...props }: Dialog.Root.Props) {
  return <Dialog.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: Dialog.Trigger.Props) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: Dialog.Close.Props) {
  return <Dialog.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: Dialog.Portal.Props) {
  return <Dialog.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-open:opacity-100",
        className
      )}
      {...props}
    />
  )
}

const sheetSideMotion = {
  top: "max-h-[40vh] border-b data-ending-style:-translate-y-full data-starting-style:-translate-y-full data-open:translate-y-0",
  bottom:
    "max-h-[40vh] border-t data-ending-style:translate-y-full data-starting-style:translate-y-full data-open:translate-y-0",
  left: "h-full max-w-sm border-r data-ending-style:-translate-x-full data-starting-style:-translate-x-full data-open:translate-x-0",
  right:
    "h-full max-w-sm border-l data-ending-style:translate-x-full data-starting-style:translate-x-full data-open:translate-x-0",
} as const

const sheetViewportAlign: Record<keyof typeof sheetSideMotion, string> = {
  top: "items-start",
  bottom: "items-end",
  left: "justify-start",
  right: "justify-end",
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: Dialog.Popup.Props & {
  side?: keyof typeof sheetSideMotion
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Viewport
        className={cn(
          "fixed inset-0 z-50 flex w-screen",
          sheetViewportAlign[side]
        )}
      >
        <Dialog.Popup
          data-slot="sheet-content"
          className={cn(
            "relative flex w-full flex-col gap-4 bg-background p-6 shadow-lg transition-transform duration-200 ease-out",
            sheetSideMotion[side],
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4"
                  size="icon-sm"
                />
              }
            >
              <span className="sr-only">Close</span>
              <XIcon data-icon="inline-start" />
            </Dialog.Close>
          )}
        </Dialog.Popup>
      </Dialog.Viewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2 pr-10 text-left", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: Dialog.Title.Props) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn("font-heading text-foreground text-lg font-medium", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: Dialog.Description.Props) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
