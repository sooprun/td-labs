import {
  IconAt,
  IconClipboardPlus,
  IconDotsVertical,
  IconListDetails,
  IconTags,
  IconUsers,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DataTableToolbarGroup,
  DataTableToolbarSlot,
  DataTableToolbarSpacer,
} from "@/components/data-table/DataTableToolbar"
import { AccountsMoreActionsMenu } from "@/features/accounts/components/AccountsMoreActionsMenu"

type AccountsBulkActionsBarProps = {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
}

export function AccountsBulkActionsBar({
  selectedCount,
  onClearSelection,
  onSelectAll,
}: AccountsBulkActionsBarProps) {
  return (
    <DataTableToolbarSlot>
      <DataTableToolbarGroup className="shrink-0">
        <span className="text-lg font-semibold">{selectedCount} selected</span>
        <Button onClick={onClearSelection} size="icon" variant="ghost">
          <IconX className="size-4" />
        </Button>
        <Button onClick={onSelectAll} variant="outline">
          Select all items
        </Button>
      </DataTableToolbarGroup>
      <DataTableToolbarGroup className="hidden shrink-0 md:flex">
        <Button variant="ghost">
          <IconListDetails className="size-4" />
          Send organizer
        </Button>
        <Button variant="ghost">
          <IconClipboardPlus className="size-4" />
          Add job
        </Button>
        <Button className="hidden lg:inline-flex" variant="ghost">
          <IconUsers className="size-4" />
          Manage team
        </Button>
        <Button className="hidden xl:inline-flex" disabled variant="ghost">
          <IconAt className="size-4" />
          Send email
        </Button>
        <Button className="hidden xl:inline-flex" variant="ghost">
          <IconTags className="size-4" />
          Manage tags
        </Button>
      </DataTableToolbarGroup>
      <DataTableToolbarSpacer />
      <DataTableToolbarGroup className="shrink-0">
        <Button size="icon" variant="ghost">
          <IconDotsVertical className="size-4" />
        </Button>
        <AccountsMoreActionsMenu />
      </DataTableToolbarGroup>
    </DataTableToolbarSlot>
  )
}
