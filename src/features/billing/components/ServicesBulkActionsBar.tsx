import { IconArchive, IconCurrencyDollar, IconTableImport, IconTrash } from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"
import { DataTableBulkActionsBar } from "@/components/data-table/DataTableToolbar"

type ServicesBulkActionsBarProps = {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
  onBulkUpdateRates: () => void
  onImportCsv: () => void
}

export function ServicesBulkActionsBar({
  selectedCount,
  onClearSelection,
  onSelectAll,
  onBulkUpdateRates,
  onImportCsv,
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
          icon: IconTableImport,
          label: "Update client overrides via CSV",
          onClick: onImportCsv,
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
