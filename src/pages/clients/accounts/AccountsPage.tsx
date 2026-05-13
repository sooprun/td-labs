import * as React from "react"
import {
  IconChevronDown,
  IconFilter,
  IconPrinter,
  IconSearch,
  IconStar,
  IconUpload,
} from "@tabler/icons-react"

import { PageHeader, PageLayout } from "@/components/page/PageLayout"
import { StatusTabs } from "@/components/page/StatusTabs"
import {
  DataTableToolbarGroup,
  DataTableToolbarSlot,
  DataTableToolbarSpacer,
} from "@/components/data-table/DataTableToolbar"
import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { Input } from "@/components/ui/input"
import { AccountsBulkActionsBar } from "@/features/accounts/components/AccountsBulkActionsBar"
import { AccountsTable, type AccountSortKey } from "@/features/accounts/components/AccountsTable"
import { accounts } from "@/mock/accounts"
import type { SortDir } from "@/components/data-table/DataTableSortIcon"
import type { ServiceItem } from "@/mock/services"
import { SetCustomRatesPanel } from "@/features/billing/components/SetCustomRatesPanel"
import { toast } from "sonner"

type AccountsPageProps = {
  onNavigate: (path: string) => void
  services: ServiceItem[]
  onServicesChange: (items: ServiceItem[]) => void
}

export function AccountsPage({ onNavigate, services, onServicesChange }: AccountsPageProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sortKey, setSortKey] = React.useState<AccountSortKey>("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [customRatesPanelOpen, setCustomRatesPanelOpen] = React.useState(false)

  const handleSort = React.useCallback((key: AccountSortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }, [sortKey])

  const sorted = React.useMemo(() => {
    return [...accounts].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      let cmp: number
      if (av === null && bv === null) cmp = 0
      else if (av === null) cmp = 1
      else if (bv === null) cmp = -1
      else if (typeof av === "number" && typeof bv === "number") cmp = av - bv
      else cmp = String(av).localeCompare(String(bv))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [sortKey, sortDir])

  const toggleAccount = React.useCallback((accountId: string) => {
    setSelectedIds((current) =>
      current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId]
    )
  }, [])

  const toggleAll = React.useCallback(() => {
    setSelectedIds((current) =>
      current.length === accounts.length
        ? []
        : accounts.map((account) => account.id)
    )
  }, [])

  const selectAll = React.useCallback(() => {
    setSelectedIds(accounts.map((account) => account.id))
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedIds([])
  }, [])

  return (
    <PageLayout>
      <PageHeader title="Accounts">
        <StatusTabs
          tabs={[
            { label: "Active", active: true },
            { label: "Archived" },
            { label: "Pending activation" },
          ]}
        />
      </PageHeader>

      {selectedIds.length > 0 ? (
        <AccountsBulkActionsBar
          onClearSelection={clearSelection}
          onSelectAll={selectAll}
          selectedCount={selectedIds.length}
          onSetCustomRates={() => setCustomRatesPanelOpen(true)}
        />
      ) : (
        <AccountsToolbar />
      )}

      <AccountsTable
        accounts={sorted}
        onNavigate={onNavigate}
        onToggleAccount={toggleAccount}
        onToggleAll={toggleAll}
        onSort={handleSort}
        selectedIds={selectedIds}
        sortDir={sortDir}
        sortKey={sortKey}
      />

      <SetCustomRatesPanel
        open={customRatesPanelOpen}
        selectedAccounts={accounts.filter((a) => selectedIds.includes(a.id))}
        services={services}
        onClose={() => setCustomRatesPanelOpen(false)}
        onSave={(updated) => {
          onServicesChange(updated)
          setCustomRatesPanelOpen(false)
          clearSelection()
          toast.success("Client prices saved")
        }}
      />
    </PageLayout>
  )
}

function AccountsToolbar() {
  return (
    <DataTableToolbarSlot>
      <DataTableToolbarGroup className="shrink-0">
        <Button size="xl" variant="ghost" onClick={protoAction("Favorites")}>
          <IconStar className="size-4" />
          Favorites
          <IconChevronDown className="size-3.5" />
        </Button>
        <Button size="xl" variant="ghost" onClick={protoAction("Filter")}>
          <IconFilter className="size-4" />
          Filter
          <IconChevronDown className="size-3.5" />
        </Button>
      </DataTableToolbarGroup>
      <DataTableToolbarSpacer />
      <DataTableToolbarGroup className="shrink-0">
        <Button size="xl" className="hidden lg:inline-flex" onClick={protoAction("New account")}>New account</Button>
        <Button size="xl" className="hidden lg:inline-flex" variant="outline" onClick={protoAction("Import")}>
          Import
        </Button>
        <Button className="hidden lg:inline-flex" size="icon-xl" variant="ghost" onClick={protoAction("Export")}>
          <IconUpload className="size-4" />
        </Button>
        <Button className="hidden lg:inline-flex" size="icon-xl" variant="ghost" onClick={protoAction("Print")}>
          <IconPrinter className="size-4" />
        </Button>
        <div className="relative hidden w-56 lg:block">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 h-10" style={{ backgroundColor: 'var(--background)' }} placeholder="Search" />
        </div>
      </DataTableToolbarGroup>
    </DataTableToolbarSlot>
  )
}
