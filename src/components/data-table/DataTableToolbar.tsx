import type { ComponentType, ReactNode } from "react"
import { IconX } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
        "flex min-h-10 w-full min-w-0 items-center gap-3",
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

type DataTableBulkAction = {
  label: string
  icon?: ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
  disabledTooltip?: string
  className?: string
  variant?: "ghost" | "destructive-ghost"
}

type DataTableBulkActionsBarProps = {
  selectedCount: number
  actions: DataTableBulkAction[]
  moreActions?: ReactNode
  onClearSelection: () => void
  onSelectAll: () => void
  selectAllLabel?: string
}

export function DataTableBulkActionsBar({
  selectedCount,
  actions,
  moreActions,
  onClearSelection,
  onSelectAll,
  selectAllLabel = "Select all items",
}: DataTableBulkActionsBarProps) {
  return (
    <DataTableToolbarSlot>
      <DataTableToolbarGroup className="shrink-0">
        <span className="text-lg font-semibold">{selectedCount} selected</span>
        <Button onClick={onClearSelection} size="icon-xl" variant="ghost">
          <IconX className="size-4" />
        </Button>
        <Button onClick={onSelectAll} size="xl" variant="outline" className="px-5">
          {selectAllLabel}
        </Button>
      </DataTableToolbarGroup>

      <DataTableToolbarGroup className="hidden shrink-0 md:flex">
        <TooltipProvider>
          {actions.map((action) => {
            const Icon = action.icon
            const btn = (
              <Button
                className={cn("shrink-0", action.className)}
                disabled={action.disabled}
                key={action.label}
                onClick={action.onClick}
                size="xl"
                variant={action.variant ?? "ghost"}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {action.label}
              </Button>
            )

            if (action.disabled && action.disabledTooltip) {
              return (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    <span>{btn}</span>
                  </TooltipTrigger>
                  <TooltipContent hideArrow className="bg-background text-foreground text-xs border shadow-md">{action.disabledTooltip}</TooltipContent>
                </Tooltip>
              )
            }

            return btn
          })}
        </TooltipProvider>
        {moreActions}
      </DataTableToolbarGroup>
    </DataTableToolbarSlot>
  )
}
