import { IconArchive, IconCopy, IconCurrencyDollar, IconTrash } from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"
import { DataTableBulkActionsBar } from "@/components/data-table/DataTableToolbar"

type ServicesBulkActionsBarProps = {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
  onBulkUpdateRates: () => void
}

export function ServicesBulkActionsBar({
  selectedCount,
  onClearSelection,
  onSelectAll,
  onBulkUpdateRates,
}: ServicesBulkActionsBarProps) {
  return (
    <DataTableBulkActionsBar
      selectedCount={selectedCount}
      onClearSelection={onClearSelection}
      onSelectAll={onSelectAll}
      selectAllLabel="Select all services"
      actions={[
        {
          icon: IconCurrencyDollar,
          label: "Update rates",
          onClick: onBulkUpdateRates,
        },
        {
          icon: IconCopy,
          label: "Duplicate",
          onClick: protoAction("Services duplicated"),
        },
        {
          icon: IconArchive,
          label: "Archive",
          onClick: protoAction("Services archived"),
        },
        {
          icon: IconTrash,
          label: "Delete",
          variant: "destructive-ghost",
          onClick: protoAction("Services deleted"),
        },
      ]}
    />
  )
}
