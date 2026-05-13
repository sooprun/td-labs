import {
  IconAt,
  IconClipboardPlus,
  IconListDetails,
  IconReceiptDollar,
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
  onSetCustomRates: () => void
}

export function AccountsBulkActionsBar({
  selectedCount,
  onClearSelection,
  onSelectAll,
  onSetCustomRates,
}: AccountsBulkActionsBarProps) {
  return (
    <DataTableBulkActionsBar
      actions={[
        {
          icon: IconReceiptDollar,
          label: "Set custom rates",
          onClick: onSetCustomRates,
        },
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
          className: "hidden 2xl:inline-flex",
          disabled: true,
          icon: IconAt,
          label: "Send email",
        },
        {
          className: "hidden 2xl:inline-flex",
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
