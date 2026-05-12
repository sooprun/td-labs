import { IconArchive, IconCopy, IconTrash } from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"
import { DataTableBulkActionsBar } from "@/components/data-table/DataTableToolbar"

type ServicesBulkActionsBarProps = {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
}

export function ServicesBulkActionsBar({
  selectedCount,
  onClearSelection,
  onSelectAll,
}: ServicesBulkActionsBarProps) {
  return (
    <DataTableBulkActionsBar
      selectedCount={selectedCount}
      onClearSelection={onClearSelection}
      onSelectAll={onSelectAll}
      selectAllLabel="Select all services"
      actions={[
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
          onClick: protoAction("Services deleted"),
        },
      ]}
    />
  )
}
