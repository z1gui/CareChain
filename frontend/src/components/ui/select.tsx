"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/utils"

function Select({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  return (
    <SelectPrimitive.Root {...props}>
      {children}
    </SelectPrimitive.Root>
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border-0 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="material-symbols-outlined text-sm text-outline">
        expand_more
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  children,
  ...props
}: SelectPrimitive.Portal.Props & { className?: string }) {
  return (
    <SelectPrimitive.Portal {...props}>
      <SelectPrimitive.Backdrop className="fixed inset-0 bg-black/10" />
      <SelectPrimitive.Positioner className="z-50">
        <SelectPrimitive.Popup
          className={cn(
            "rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-1 shadow-lg",
            className
          )}
        >
          <SelectPrimitive.ScrollUpArrow />
          <SelectPrimitive.List className="max-h-60 overflow-auto">
            {children}
          </SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-on-surface outline-none transition-colors hover:bg-surface-container-high data-[highlighted]:bg-surface-container-high",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 text-primary">
        <span className="material-symbols-outlined text-sm">check</span>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
