import {
  IconAt,
  IconClipboardPlus,
  IconListDetails,
  IconTags,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import {
  DataTableToolbarGroup,
  DataTableToolbarSlot,
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
        <Button variant="ghost" className="text-primary hover:bg-[#F2F9FF] hover:text-primary" onClick={protoAction("Organizer sent")}>
          <IconListDetails className="size-4" />
          Send organizer
        </Button>
        <Button variant="ghost" className="text-primary hover:bg-[#F2F9FF] hover:text-primary" onClick={protoAction("Job added")}>
          <IconClipboardPlus className="size-4" />
          Add job
        </Button>
        <Button className="hidden lg:inline-flex text-primary hover:bg-[#F2F9FF] hover:text-primary" variant="ghost" onClick={protoAction("Team updated")}>
          <IconUsers className="size-4" />
          Manage team
        </Button>
        <Button className="hidden xl:inline-flex" disabled variant="ghost">
          <IconAt className="size-4" />
          Send email
        </Button>
        <Button className="hidden xl:inline-flex text-primary hover:bg-[#F2F9FF] hover:text-primary" variant="ghost" onClick={protoAction("Tags updated")}>
          <IconTags className="size-4" />
          Manage tags
        </Button>
        <AccountsMoreActionsMenu />
      </DataTableToolbarGroup>
    </DataTableToolbarSlot>
  )
}
