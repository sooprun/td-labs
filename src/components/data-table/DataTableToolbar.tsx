import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DataTableToolbarSlotProps = {
  children: ReactNode
  className?: string
}

export function DataTableToolbarSlot({
  children,
  className,
}: DataTableToolbarSlotProps) {
  return (
    <div
      className={cn(
        "mb-4 flex h-10 min-w-0 items-center gap-3 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}

type DataTableToolbarGroupProps = {
  children: ReactNode
  className?: string
}

export function DataTableToolbarGroup({
  children,
  className,
}: DataTableToolbarGroupProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {children}
    </div>
  )
}

export function DataTableToolbarSpacer() {
  return <div className="min-w-0 flex-1" />
}
