import * as React from "react"
import {
  IconChevronDown,
  IconFilter,
  IconPrinter,
  IconSearch,
  IconStar,
  IconDotsVertical,
  IconDownload,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react"

import { PageHeader, PageLayout } from "@/components/page/PageLayout"
import {
  DataTableBulkActionsBar,
  DataTableToolbarGroup,
  DataTableToolbarSlot,
  DataTableToolbarSpacer,
} from "@/components/data-table/DataTableToolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { protoAction } from "@/lib/proto"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import { invoices, invoiceSummary, type InvoiceItem, type InvoiceStatus } from "@/mock/data/invoices"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid:    "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  Unpaid:  "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Overdue: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Draft:   "bg-muted text-muted-foreground",
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = keyof Pick<InvoiceItem, "number" | "accountName" | "status" | "assignee" | "postedAt" | "total" | "amountPaid" | "balanceDue" | "lastPaidAt">

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InvoicesPage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [sortKey, setSortKey] = React.useState<SortKey>("postedAt")
  const [sortDir, setSortDir] = React.useState<SortDir>("desc")

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...invoices].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (av === null && bv === null) return 0
    if (av === null) return 1
    if (bv === null) return -1
    let cmp: number
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv
    else cmp = String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  })

  const allSelected = sorted.length > 0 && selectedIds.length === sorted.length
  const toggleAll = () => setSelectedIds(allSelected ? [] : sorted.map((i) => i.id))
  const toggleOne = (id: string) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  )

  return (
    <PageLayout>
      <PageHeader title="Invoices" />

      {/* Summary bar */}
      <DataTableToolbarSlot className="gap-4 text-sm text-muted-foreground">
        <span>Number of invoices: <strong className="text-foreground">{invoiceSummary.total.toLocaleString()}</strong></span>
        <div className="h-4 w-px bg-border" />
        <span>Paid: <strong className="text-foreground">{formatMoney(invoiceSummary.paid)}</strong></span>
        <div className="h-4 w-px bg-border" />
        <span>Unpaid: <strong className="text-foreground">{formatMoney(invoiceSummary.unpaid)}</strong></span>
      </DataTableToolbarSlot>

      {/* Toolbar */}
      {selectedIds.length > 0 ? (
        <DataTableBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onSelectAll={() => setSelectedIds(sorted.map((i) => i.id))}
          selectAllLabel="Select all invoices"
          actions={[
            {
              icon: IconTrash,
              label: "Delete",
              variant: "destructive-ghost",
              onClick: protoAction("Invoices deleted"),
            },
          ]}
        />
      ) : (
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
          <Button size="xl" variant="outline" className="hidden lg:inline-flex" onClick={protoAction("Export invoices")}>
            <IconDownload className="size-4" />
            Export invoices
          </Button>
          <Button className="hidden lg:inline-flex" size="icon-xl" variant="ghost" onClick={protoAction("Print")}>
            <IconPrinter className="size-4" />
          </Button>
          <div className="relative hidden w-56 lg:block">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 h-10" style={{ backgroundColor: "var(--background)" }} placeholder="Search" />
          </div>
        </DataTableToolbarGroup>
      </DataTableToolbarSlot>
      )}

      {/* Table */}
      <div className="table-striped overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-40 bg-background">
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="table-checkbox" checked={allSelected} onChange={toggleAll} />
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("number")}>
                <span className="inline-flex items-center">
                  Invoice number
                  <DataTableSortIcon col="number" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("accountName")}>
                <span className="inline-flex items-center">
                  Account
                  <DataTableSortIcon col="accountName" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("status")}>
                <span className="inline-flex items-center">
                  Status
                  <DataTableSortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("assignee")}>
                <span className="inline-flex items-center">
                  Assignee
                  <DataTableSortIcon col="assignee" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("postedAt")}>
                <span className="inline-flex items-center">
                  Posted
                  <DataTableSortIcon col="postedAt" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right hover:text-foreground" onClick={() => handleSort("total")}>
                <span className="inline-flex items-center justify-end w-full">
                  Total
                  <DataTableSortIcon col="total" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right hover:text-foreground" onClick={() => handleSort("amountPaid")}>
                <span className="inline-flex items-center justify-end w-full">
                  Amount paid
                  <DataTableSortIcon col="amountPaid" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right hover:text-foreground" onClick={() => handleSort("balanceDue")}>
                <span className="inline-flex items-center justify-end w-full">
                  Balance due
                  <DataTableSortIcon col="balanceDue" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("lastPaidAt")}>
                <span className="inline-flex items-center">
                  Last paid
                  <DataTableSortIcon col="lastPaidAt" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="w-10 px-0">
                <Button size="icon-xl" variant="ghost" onClick={protoAction("Table settings")}>
                  <IconSettings className="size-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((inv) => (
              <TableRow
                key={inv.id}
                className="group"
                data-state={selectedIds.includes(inv.id) ? "selected" : undefined}
              >
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedIds.includes(inv.id)}
                    onChange={() => toggleOne(inv.id)}
                  />
                </TableCell>
                <TableCell>
                  <button
                    className="font-medium text-primary hover:underline"
                    onClick={protoAction("Open invoice")}
                  >
                    {inv.number}
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    className="text-primary hover:underline"
                    onClick={protoAction("Open account")}
                  >
                    {inv.accountName}
                  </button>
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{inv.assignee}</TableCell>
                <TableCell className="text-muted-foreground">{inv.postedAt ?? "—"}</TableCell>
                <TableCell className="text-right font-medium">{formatMoney(inv.total)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatMoney(inv.amountPaid)}</TableCell>
                <TableCell className="text-right font-medium">
                  {inv.balanceDue > 0 ? formatMoney(inv.balanceDue) : <span className="text-muted-foreground">{formatMoney(0)}</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">{inv.lastPaidAt ?? "—"}</TableCell>
                <TableCell className="w-10 px-0">
                  <Button size="icon-xl" variant="ghost" onClick={protoAction("Invoice actions")}>
                    <IconDotsVertical className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  )
}
