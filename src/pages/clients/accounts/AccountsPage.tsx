import * as React from "react"
import {
  IconDownload,
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
import { AccountsTable } from "@/features/accounts/components/AccountsTable"
import { accounts } from "@/mock/data/accounts"

export function AccountsPage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

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
        />
      ) : (
        <AccountsToolbar />
      )}

      <AccountsTable
        accounts={accounts}
        onToggleAccount={toggleAccount}
        onToggleAll={toggleAll}
        selectedIds={selectedIds}
      />
    </PageLayout>
  )
}

function AccountsToolbar() {
  return (
    <DataTableToolbarSlot>
      <DataTableToolbarGroup className="shrink-0">
        <Button size="sm" variant="ghost" onClick={protoAction("Favorites")}>
          <IconStar className="size-4" />
          Favorites
        </Button>
        <Button size="sm" variant="ghost" onClick={protoAction("Filter")}>
          <IconFilter className="size-4" />
          Filter
        </Button>
      </DataTableToolbarGroup>
      <DataTableToolbarSpacer />
      <DataTableToolbarGroup className="shrink-0">
        <Button className="hidden md:inline-flex" onClick={protoAction("New account")}>New account</Button>
        <Button className="hidden md:inline-flex" variant="outline" onClick={protoAction("Import")}>
          Import
        </Button>
        <Button className="hidden sm:inline-flex" size="icon" variant="ghost" onClick={protoAction("Export")}>
          <IconUpload className="size-4" />
        </Button>
        <Button className="hidden sm:inline-flex" size="icon" variant="ghost" onClick={protoAction("Print")}>
          <IconPrinter className="size-4" />
        </Button>
        <Button className="hidden sm:inline-flex" size="icon" variant="ghost" onClick={protoAction("Download")}>
          <IconDownload className="size-4" />
        </Button>
        <div className="relative hidden w-64 lg:block">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search" />
        </div>
      </DataTableToolbarGroup>
    </DataTableToolbarSlot>
  )
}
