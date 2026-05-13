import { IconArchive, IconCurrencyDollar, IconTrash } from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"
import { DataTableBulkActionsBar } from "@/components/data-table/DataTableToolbar"

type Props = {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
  onUpdateRates: () => void
}

export function TeamRatesBulkActionsBar({ selectedCount, onClearSelection, onSelectAll, onUpdateRates }: Props) {
  return (
    <DataTableBulkActionsBar
      selectedCount={selectedCount}
      onClearSelection={onClearSelection}
      onSelectAll={onSelectAll}
      selectAllLabel="Select all"
      actions={[
        {
          icon: IconCurrencyDollar,
          label: "Update rates",
          onClick: onUpdateRates,
        },
        {
          icon: IconArchive,
          label: "Archive",
          onClick: protoAction("Rate groups archived"),
        },
        {
          icon: IconTrash,
          label: "Delete",
          onClick: protoAction("Rate groups deleted"),
        },
      ]}
    />
  )
}
