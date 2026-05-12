import {
  IconAt,
  IconClipboardPlus,
  IconListDetails,
  IconTags,
  IconUsers,
} from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"
import { DataTableBulkActionsBar } from "@/components/data-table/DataTableToolbar"
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
    <DataTableBulkActionsBar
      actions={[
        {
          icon: IconListDetails,
          label: "Send organizer",
          onClick: protoAction("Organizer sent"),
        },
        {
          icon: IconClipboardPlus,
          label: "Add job",
          onClick: protoAction("Job added"),
        },
        {
          className: "hidden lg:inline-flex",
          icon: IconUsers,
          label: "Manage team",
          onClick: protoAction("Team updated"),
        },
        {
          className: "hidden xl:inline-flex",
          disabled: true,
          icon: IconAt,
          label: "Send email",
        },
        {
          className: "hidden xl:inline-flex",
          icon: IconTags,
          label: "Manage tags",
          onClick: protoAction("Tags updated"),
        },
      ]}
      moreActions={<AccountsMoreActionsMenu />}
      onClearSelection={onClearSelection}
      onSelectAll={onSelectAll}
      selectedCount={selectedCount}
    />
  )
}
